import express from 'express';
import { createCourse, getCreatorCourses, editCourse, getCourseById, createLecture, getCourseLecture, getPublishedCourses, searchCourses, getPublishedCourseById, publishCourse, fixAllCoursePrices, publishAllCourses } from '../controllers/course.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from "../utils/multer.js";

const router = express.Router();
router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/published-courses").get(getPublishedCourses); // Public route - no authentication needed
router.route("/search").get(searchCourses); // Public search route - no authentication needed
router.route("/public/:courseId").get(getPublishedCourseById); // Public course details - no authentication needed
router.route("/:courseId").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId").patch(isAuthenticated, publishCourse); // Publish/unpublish course
router.route("/fix-prices").post(isAuthenticated, fixAllCoursePrices); // Fix all course prices
router.route("/publish-all").post(isAuthenticated, publishAllCourses); // Publish all courses
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
export default router;