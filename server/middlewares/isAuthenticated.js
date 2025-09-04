import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

// Enhanced authentication middleware
const isAuthenticated = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not logged in! Please log in to get access."
            });
        }

        // 2) Verification token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token. Please log in again!"
                });
            } else if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Your token has expired! Please log in again."
                });
            }
            return res.status(401).json({
                success: false,
                message: "Token verification failed"
            });
        }

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.userId).select('-password');
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "The user belonging to this token does no longer exist."
            });
        }

        // 4) Grant access to protected route
        req.user = currentUser;
        req.id = currentUser._id.toString(); // Convert ObjectId to string
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to authenticate user."
        });
    }
};

// Role-based authorization middleware
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }
        next();
    };
};

// Check if user is course creator
export const isCourseCreator = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        // Import Course model here to avoid circular dependency
        const { Course } = await import("../models/course.model.js");

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (course.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this course"
            });
        }

        req.course = course;
        next();
    } catch (error) {
        console.error('Course creator check error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify course ownership"
        });
    }
};

export default isAuthenticated;