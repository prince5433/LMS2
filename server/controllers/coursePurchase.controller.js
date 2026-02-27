import Stripe from "stripe";
import mongoose from 'mongoose';
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

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Update success_url and cancel_url
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
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
    console.log(error);
    return res.status(500).json({ message: "Failed to create checkout session" });
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

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Validate if courseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const purchased = await CoursePurchase.findOne({ userId, courseId, status: "completed" });

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.error('Error in getCourseDetailWithPurchaseStatus:', error);
    return res.status(500).json({
      message: "An error occurred while fetching course details",
      error: error.message
    });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get purchased courses" });
  }
};

export const verifyPurchase = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const purchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "pending",
    });

    if (!purchase) {
      // Check if already completed
      const completedPurchase = await CoursePurchase.findOne({
        userId,
        courseId,
        status: "completed",
      });
      if (completedPurchase) {
        return res.status(200).json({ success: true, message: "Already enrolled" });
      }
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(purchase.paymentId);

    if (session.payment_status === "paid") {
      purchase.status = "completed";
      purchase.amount = session.amount_total / 100;
      await purchase.save();

      // Enroll user in course
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourses: courseId } },
        { new: true }
      );

      // Add user to course's enrolledStudents
      await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { enrolledStudents: userId } },
        { new: true }
      );

      // Make lectures visible
      const course = await Course.findById(courseId);
      if (course && course.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: course.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      return res.status(200).json({ success: true, message: "Course purchased successfully" });
    } else {
      return res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to verify purchase" });
  }
};
