import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
// import { asyncHandler } from "../middlewares/errorHandler.js";
// import logger, { logAuth, logError } from "../utils/logger.js";

// Temporary asyncHandler replacement
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Temporary logging functions
const logAuth = (action, userId, success, details) => {
    console.log(`Auth ${action}:`, { userId, success, details });
};

const logger = {
    info: (message, meta) => console.log(`INFO: ${message}`, meta),
    error: (message, meta) => console.error(`ERROR: ${message}`, meta)
};

export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Input validation
    if (!name || !email || !password) {
        logAuth('register', null, false, { reason: 'Missing required fields', email });
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        logAuth('register', null, false, { reason: 'Invalid email format', email });
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    // Password strength validation
    if (password.length < 8) {
        logAuth('register', null, false, { reason: 'Weak password', email });
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        logAuth('register', null, false, { reason: 'User already exists', email });
        return res.status(409).json({
            success: false,
            message: "User with this email already exists."
        });
    }

    // Hash password
    const saltRounds = 12; // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'student'
    });

    // Log successful registration
    logAuth('register', newUser._id, true, { email: newUser.email, role: newUser.role });

    // Remove password from response
    const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photoUrl: newUser.photoUrl,
        createdAt: newUser.createdAt
    };

    logger.info('New user registered successfully', { userId: newUser._id, email: newUser.email });

    return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        user: userResponse
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        logAuth('login', null, false, { reason: 'Missing credentials', email });
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        logAuth('login', null, false, { reason: 'Invalid email format', email });
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
        logAuth('login', null, false, { reason: 'User not found', email });
        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        logAuth('login', user._id, false, { reason: 'Invalid password', email });
        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Log successful login
    logAuth('login', user._id, true, { email: user.email, role: user.role });

    // Generate token and send response
    generateToken(res, user, `Welcome back ${user.name}`);

    logger.info('User logged in successfully', {
        userId: user._id,
        email: user.email,
        role: user.role
    });
});

export const logout = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // Log logout attempt
    logAuth('logout', userId, true, { email: req.user?.email });

    // Clear the token cookie
    res.status(200).cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }).json({
        success: true,
        message: "Logged out successfully."
    });

    logger.info('User logged out successfully', {
        userId: userId,
        email: req.user?.email
    });
});

export const getProfile = async (req, res) => {
    try {
        const userId = req.id; // Extract user ID from the request object
        const user = await User.findById(userId).select("-password ").populate("enrolledCourses"); // Find the user by ID and exclude sensitive fields
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }
        return res.status(200).json({
            success: true,
            user,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get user profile"
        })
    }
}

export const updateProfile = async (req, res) => {
    try{
        const userId=req.id; // Extract user ID from the request object
        const {name} = req.body; // Extract the name from the request body
        const profilePhoto=req.file; // Extract the profile photo path from the request file

        const user=await User.findById(userId); // Find the user by ID
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        //extract the publicid of the old image from the url if it exist
        if(user.photoUrl){//agr phle se image hai to uska public id nikal lo
            const publicId=user.photoUrl.split("/").pop().split(".")[0]; // Extract the public ID from the URL
             deleteMediaFromCloudinary(publicId); // Delete the old image from Cloudinary
        }

        //upload new photo to cloudinary
        const cloudResponse=await uploadMedia(profilePhoto.path); // Upload the new photo to Cloudinary
        const photoUrl=cloudResponse.secure_url; // Get the secure URL of the uploaded photo

        const updatedData={name,photoUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password"); // Update the user in the database

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user profile"
        })
    }
}

// Manual enrollment function for testing
export const enrollInCourse = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        // Add course to user's enrolled courses
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { enrolledCourses: courseId } },
            { new: true }
        ).populate("enrolledCourses");

        // Add user to course's enrolled students
        await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { enrolledStudents: userId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Successfully enrolled in course",
            user: updatedUser
        });
    } catch (error) {
        console.error("Enrollment error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to enroll in course"
        });
    }
};