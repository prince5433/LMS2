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
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}?payment_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}?payment_cancelled=true`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
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
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
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

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
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

    // Get all courses created by this instructor
    const instructorCourses = await Course.find({ creator: instructorId });
    const courseIds = instructorCourses.map(course => course._id);

    // Get all completed purchases for instructor's courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate("courseId").populate("userId", "name email");

    // Calculate stats
    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalSales = purchases.length;
    const totalStudents = new Set(purchases.map(p => p.userId._id.toString())).size;

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

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalSales,
        totalStudents,
        totalCourses: instructorCourses.length,
        revenueByCourse,
        salesByMonth,
        recentSales
      }
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

    // Create a purchase record
    const purchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice || 0,
      status: "completed",
      paymentId: `manual_${Date.now()}` // Manual payment ID
    });

    await purchase.save();

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

    // Make all lectures visible
    if (course.lectures && course.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Purchase completed successfully",
      purchase
    });

  } catch (error) {
    console.error("Manual purchase completion error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete purchase"
    });
  }
};