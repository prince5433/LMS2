import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    console.log("Creating checkout session for:", { userId, courseId });

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!"
      });
    }

    console.log("Course found:", {
      title: course.courseTitle,
      price: course.coursePrice,
      priceType: typeof course.coursePrice
    });

    // Validate and sanitize course price
    let coursePrice = course.coursePrice;

    // Handle missing or invalid price
    if (!coursePrice || isNaN(coursePrice) || coursePrice <= 0) {
      console.log("Invalid course price detected:", coursePrice);
      return res.status(400).json({
        success: false,
        message: "Course price is not set or invalid. Please contact the instructor.",
        error: `Invalid price: ${coursePrice}`
      });
    }

    // Ensure price is a number and convert to integer (paise)
    const priceInPaise = Math.round(Number(coursePrice) * 100);

    console.log("Price calculation:", {
      originalPrice: coursePrice,
      priceInPaise: priceInPaise
    });

    // Validate final price
    if (isNaN(priceInPaise) || priceInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price calculation",
        error: `Calculated price: ${priceInPaise}`
      });
    }

    // Create Stripe session first to get the session ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: course.courseThumbnail ? [course.courseThumbnail] : [],
            },
            unit_amount: priceInPaise, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/mylearning`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}?payment_cancelled=true`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString()
      },
    });

    console.log("Stripe session created successfully:", session.id);

    // Create a new course purchase record with the session ID
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: Number(coursePrice), // Ensure it's stored as a number
      status: "pending",
      paymentId: session.id, // Store the session ID
    });

    console.log("Creating purchase record:", {
      courseId,
      userId,
      amount: Number(coursePrice),
      paymentId: session.id
    });



    if (!session.url) {
      console.log("No session URL returned from Stripe");
      return res.status(400).json({
        success: false,
        message: "Error while creating session - no checkout URL received"
      });
    }

    // Save the purchase record
    await newPurchase.save();
    console.log("Purchase record saved successfully");

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
      sessionId: session.id
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to create checkout session. Please try again.";

    if (error.type === 'StripeCardError') {
      errorMessage = "Payment processing error. Please check your payment details.";
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = "Invalid payment request. Please contact support.";
    } else if (error.message && error.message.includes('price')) {
      errorMessage = "Course pricing error. Please contact the instructor.";
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed webhook called");

    try {
      const session = event.data.object;
      console.log("Session data:", { id: session.id, amount_total: session.amount_total });

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      console.log("Found purchase:", purchase ? {
        id: purchase._id,
        userId: purchase.userId,
        courseId: purchase.courseId?._id,
        status: purchase.status,
        amount: purchase.amount
      } : "No purchase found");

      if (!purchase) {
        console.error("Purchase not found for session:", session.id);
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Update purchase details
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      console.log("Updating purchase status to completed");

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures && purchase.courseId.lectures.length > 0) {
        console.log("Making lectures visible for course:", purchase.courseId._id);
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();
      console.log("Purchase saved successfully");

      // Update user's enrolledCourses
      console.log("Adding course to user's enrolled courses");
      const updatedUser = await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );
      console.log("User updated, enrolled courses count:", updatedUser?.enrolledCourses?.length);

      // Update course to add user ID to enrolledStudents
      console.log("Adding user to course's enrolled students");
      const updatedCourse = await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
      console.log("Course updated, enrolled students count:", updatedCourse?.enrolledStudents?.length);

      console.log("Webhook processing completed successfully");
    } catch (error) {
      console.error("Error handling webhook event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ 
      userId, 
      courseId
    });
    
    // If purchase exists but enrollment is missing, fix it automatically
    if (purchased && purchased.status === "pending") {
      try {
        // Complete the purchase and enrollment
        purchased.status = "completed";
        await purchased.save();
        
        // Add user to course enrollment
        await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });
        await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });
        
        console.log("Auto-fixed pending purchase and enrollment");
      } catch (error) {
        console.log("Error auto-fixing enrollment:", error);
      }
    }
    
    console.log("Purchase status check:", purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased false otherwise
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details"
    });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;
    const purchasedCourses = await CoursePurchase.find({
      userId: userId,
      status: "completed",
    }).populate({
      path: "courseId",
      populate: {
        path: "creator",
        select: "name email"
      }
    });

    return res.status(200).json({
      success: true,
      purchasedCourses: purchasedCourses || [],
    });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchased courses"
    });
  }
};

// Get instructor revenue and stats
export const getInstructorStats = async (req, res) => {
  try {
    const instructorId = req.id;

    console.log("=== INSTRUCTOR STATS DEBUG ===");
    console.log("Instructor ID:", instructorId);

    // Get all courses created by this instructor
    const instructorCourses = await Course.find({ creator: instructorId });
    const courseIds = instructorCourses.map(course => course._id);

    console.log("Instructor courses found:", instructorCourses.length);
    console.log("Course IDs:", courseIds);
    console.log("Courses:", instructorCourses.map(c => ({ id: c._id, title: c.courseTitle, price: c.coursePrice })));

    // Get all completed purchases for instructor's courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate("courseId").populate("userId", "name email");

    console.log("Completed purchases found:", purchases.length);
    console.log("Purchase details:", purchases.map(p => ({
      id: p._id,
      courseId: p.courseId?._id,
      courseTitle: p.courseId?.courseTitle,
      amount: p.amount,
      status: p.status,
      studentName: p.userId?.name,
      createdAt: p.createdAt
    })));

    // Calculate stats
    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalSales = purchases.length;
    const totalStudents = new Set(purchases.map(p => p.userId._id.toString())).size;

    console.log("Calculated stats:", { totalRevenue, totalSales, totalStudents });

    // Revenue by course
    const revenueByCourse = {};
    const salesByMonth = {};

    purchases.forEach(purchase => {
      const courseTitle = purchase.courseId.courseTitle;
      const month = new Date(purchase.createdAt).toISOString().slice(0, 7); // YYYY-MM

      revenueByCourse[courseTitle] = (revenueByCourse[courseTitle] || 0) + purchase.amount;
      salesByMonth[month] = (salesByMonth[month] || 0) + purchase.amount;
    });

    // Recent sales (last 10)
    const recentSales = purchases
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(purchase => ({
        courseName: purchase.courseId.courseTitle,
        studentName: purchase.userId.name,
        amount: purchase.amount,
        date: purchase.createdAt
      }));

    const finalStats = {
      totalRevenue,
      totalSales,
      totalStudents,
      totalCourses: instructorCourses.length,
      revenueByCourse,
      salesByMonth,
      recentSales
    };

    console.log("Final stats being returned:", finalStats);
    console.log("=== END INSTRUCTOR STATS DEBUG ===");

    return res.status(200).json({
      success: true,
      stats: finalStats
    });
  } catch (error) {
    console.error("Error fetching instructor stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor stats"
    });
  }
};

// Manual purchase completion for testing
export const completePurchaseManually = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.id;

    console.log("Manual purchase completion called:", { userId, courseId });

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    console.log("Course found:", {
      id: course._id,
      title: course.courseTitle,
      price: course.coursePrice
    });

    // Check if purchase already exists
    const existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed"
    });

    if (existingPurchase) {
      console.log("Purchase already exists:", existingPurchase._id);
      return res.status(400).json({
        success: false,
        message: "Course already purchased"
      });
    }

    // Create a purchase record
    const purchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice || 0,
      status: "completed",
      paymentId: `manual_${Date.now()}` // Manual payment ID
    });

    await purchase.save();
    console.log("Purchase record created:", purchase._id);

    // Update user's enrolledCourses
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );
    console.log("User updated, enrolled courses count:", updatedUser?.enrolledCourses?.length);

    // Update course to add user ID to enrolledStudents
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );
    console.log("Course updated, enrolled students count:", updatedCourse?.enrolledStudents?.length);

    // Make all lectures visible
    if (course.lectures && course.lectures.length > 0) {
      console.log("Making lectures visible, count:", course.lectures.length);
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    console.log("Manual purchase completion successful");

    return res.status(200).json({
      success: true,
      message: "Purchase completed successfully",
      purchase: {
        id: purchase._id,
        courseId: purchase.courseId,
        userId: purchase.userId,
        amount: purchase.amount,
        status: purchase.status
      }
    });

  } catch (error) {
    console.error("Manual purchase completion error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete purchase",
      error: error.message
    });
  }
};

// Debug endpoint to check purchase and enrollment status
export const debugPurchaseStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    // Get user with enrolled courses
    const user = await User.findById(userId).populate('enrolledCourses');

    // Get all purchases for this user
    const allPurchases = await CoursePurchase.find({ userId }).populate('courseId');

    // Get specific purchase for this course
    const specificPurchase = await CoursePurchase.findOne({
      userId,
      courseId
    }).populate('courseId');

    // Get course with enrolled students
    const course = await Course.findById(courseId).populate('enrolledStudents');

    return res.status(200).json({
      success: true,
      debug: {
        userId,
        courseId,
        user: {
          id: user?._id,
          name: user?.name,
          enrolledCoursesCount: user?.enrolledCourses?.length || 0,
          enrolledCourses: user?.enrolledCourses?.map(c => ({
            id: c._id,
            title: c.courseTitle
          })) || []
        },
        allPurchases: allPurchases.map(p => ({
          id: p._id,
          courseId: p.courseId?._id,
          courseTitle: p.courseId?.courseTitle,
          status: p.status,
          amount: p.amount
        })),
        specificPurchase: specificPurchase ? {
          id: specificPurchase._id,
          status: specificPurchase.status,
          amount: specificPurchase.amount
        } : null,
        course: course ? {
          id: course._id,
          title: course.courseTitle,
          enrolledStudentsCount: course.enrolledStudents?.length || 0,
          isUserEnrolled: course.enrolledStudents?.some(s => s._id.toString() === userId)
        } : null
      }
    });

  } catch (error) {
    console.error("Debug purchase status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get debug info",
      error: error.message
    });
  }
};

// Test endpoint to create a sample purchase for testing instructor revenue
export const createTestPurchase = async (req, res) => {
  try {
    const { courseId, amount = 1000 } = req.body;
    const userId = req.id;

    console.log("Creating test purchase:", { userId, courseId, amount });

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Create a test purchase
    const testPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: Number(amount),
      status: "completed",
      paymentId: `test_${Date.now()}`
    });

    await testPurchase.save();

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    // Update course to add user ID to enrolledStudents
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );

    console.log("Test purchase created successfully:", testPurchase._id);

    return res.status(200).json({
      success: true,
      message: "Test purchase created successfully",
      purchase: {
        id: testPurchase._id,
        courseId: testPurchase.courseId,
        userId: testPurchase.userId,
        amount: testPurchase.amount,
        status: testPurchase.status
      }
    });

  } catch (error) {
    console.error("Test purchase creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create test purchase",
      error: error.message
    });
  }
};
