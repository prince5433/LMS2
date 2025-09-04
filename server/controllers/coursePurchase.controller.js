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

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

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
            unit_amount: Math.round(course.coursePrice * 100), // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
    });

    // Create a new course purchase record with the session ID
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: session.id, // Store the session ID
    });



    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session. Please try again.",
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