import { Course } from "../models/course.model.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        //agar exisst krte hai to course create kro
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id,
        });
        return res.status(201).json({
            success: true,
            message: "Course created successfully.",
            course,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course"
        })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id; // Get the user ID from the request object
        const courses = await Course.find({ creator: userId }); // Find all courses created by the user
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for this user",
                courses: []
            });
        }
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses"
        })
    }
}