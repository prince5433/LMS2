import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, stripeWebhook, getInstructorStats, completePurchaseManually, debugPurchaseStatus, createTestPurchase } from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(express.raw({type:"application/json"}), stripeWebhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);

router.route("/").get(isAuthenticated,getAllPurchasedCourse);
router.route("/instructor/stats").get(isAuthenticated, getInstructorStats);
router.route("/complete-manually").post(isAuthenticated, completePurchaseManually);
router.route("/debug/:courseId").get(isAuthenticated, debugPurchaseStatus);
router.route("/test-purchase").post(isAuthenticated, createTestPurchase);
router.route("/debug/:courseId").get(isAuthenticated, debugPurchaseStatus);

export default router;