import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

// MongoDB ObjectId validation
export const validateObjectId = (field = 'id') => {
    return param(field)
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid ID format');
            }
            return true;
        });
};

// User validation rules
export const validateUserRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('role')
        .optional()
        .isIn(['student', 'instructor'])
        .withMessage('Role must be either student or instructor'),
    
    handleValidationErrors
];

export const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Course validation rules
export const validateCourseCreation = [
    body('courseTitle')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Course title must be between 5 and 100 characters'),
    
    body('subTitle')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Subtitle must not exceed 200 characters'),
    
    body('description')
        .trim()
        .isLength({ min: 50, max: 5000 })
        .withMessage('Description must be between 50 and 5000 characters'),
    
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    
    body('courseLevel')
        .isIn(['Beginner', 'Medium', 'Advance'])
        .withMessage('Course level must be Beginner, Medium, or Advance'),
    
    body('coursePrice')
        .isFloat({ min: 0 })
        .withMessage('Course price must be a positive number'),
    
    handleValidationErrors
];

export const validateCourseUpdate = [
    validateObjectId('courseId'),
    
    body('courseTitle')
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Course title must be between 5 and 100 characters'),
    
    body('subTitle')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Subtitle must not exceed 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ min: 50, max: 5000 })
        .withMessage('Description must be between 50 and 5000 characters'),
    
    body('category')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Category cannot be empty'),
    
    body('courseLevel')
        .optional()
        .isIn(['Beginner', 'Medium', 'Advance'])
        .withMessage('Course level must be Beginner, Medium, or Advance'),
    
    body('coursePrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Course price must be a positive number'),
    
    handleValidationErrors
];

// Lecture validation rules
export const validateLectureCreation = [
    validateObjectId('courseId'),
    
    body('lectureTitle')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Lecture title must be between 3 and 100 characters'),
    
    body('videoUrl')
        .optional()
        .isURL()
        .withMessage('Video URL must be a valid URL'),
    
    handleValidationErrors
];

// Search validation
export const validateSearch = [
    query('query')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
    
    query('categories')
        .optional()
        .custom((value) => {
            if (typeof value === 'string') {
                const categories = value.split(',');
                if (categories.length > 10) {
                    throw new Error('Too many categories selected');
                }
            }
            return true;
        }),
    
    query('sortByPrice')
        .optional()
        .isIn(['low', 'high'])
        .withMessage('Sort by price must be either low or high'),
    
    handleValidationErrors
];

// Purchase validation
export const validatePurchase = [
    validateObjectId('courseId'),
    handleValidationErrors
];

// Progress validation
export const validateProgress = [
    validateObjectId('courseId'),
    validateObjectId('lectureId'),
    handleValidationErrors
];

// Sanitize HTML content
export const sanitizeHtml = (field) => {
    return body(field)
        .customSanitizer((value) => {
            // Basic HTML sanitization - remove script tags and dangerous attributes
            if (typeof value === 'string') {
                return value
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/on\w+="[^"]*"/gi, '')
                    .replace(/javascript:/gi, '');
            }
            return value;
        });
};

export default {
    handleValidationErrors,
    validateObjectId,
    validateUserRegistration,
    validateUserLogin,
    validateCourseCreation,
    validateCourseUpdate,
    validateLectureCreation,
    validateSearch,
    validatePurchase,
    validateProgress,
    sanitizeHtml
};
