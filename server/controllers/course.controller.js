import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";

export const createCourse = async (req, res) => {
    try {
        const {
            courseTitle,
            category,
            subTitle,
            description,
            courseLevel,
            coursePrice
        } = req.body;



        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "Course title and category are required."
            })
        }

        // Validate and set course price
        let validatedPrice = 0; // Default to free
        if (coursePrice !== undefined && coursePrice !== null && coursePrice !== '') {
            const numericPrice = Number(coursePrice);
            if (!isNaN(numericPrice) && numericPrice >= 0) {
                validatedPrice = numericPrice;
            }
        }



        // Create course with all fields
        const course = await Course.create({
            courseTitle,
            category,
            subTitle: subTitle || "",
            description: description || "",
            courseLevel: courseLevel || "Beginner",
            coursePrice: validatedPrice,
            creator: req.id,
        });



        return res.status(201).json({
            success: true,
            message: "Course created successfully.",
            course,
        })
    } catch (error) {
        console.log("Create course error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course"
        })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id; // Get the user ID from the request object

        console.log("=== GET CREATOR COURSES DEBUG ===");
        console.log("User ID from request:", userId);
        console.log("Request headers:", req.headers);

        const courses = await Course.find({ creator: userId }); // Find all courses created by the user

        console.log("Courses found:", courses.length);
        console.log("Course details:", courses.map(c => ({
            id: c._id,
            title: c.courseTitle,
            creator: c.creator,
            isPublished: c.isPublished,
            price: c.coursePrice
        })));

        if (!courses || courses.length === 0) {
            console.log("No courses found for user:", userId);
            return res.status(200).json({
                success: true,
                message: "No courses found for this user",
                courses: []
            });
        }

        console.log("Returning courses successfully");
        console.log("=== END GET CREATOR COURSES DEBUG ===");

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        });
    } catch (error) {
        console.error("Error in getCreatorCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses"
        })
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId; // Get the course ID from the request parameters
        const {courseTitle,subTitle,description,courseLevel,coursePrice,category} = req.body;
        const thumbnail =req.file;

        console.log("Editing course with data:", req.body);
        console.log("Course price received:", coursePrice, "Type:", typeof coursePrice);

        let course= await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        // Check if user is the course creator
        if (course.creator.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this course."
            });
        }
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0]; // Extract the public ID from the URL
                await deleteMediaFromCloudinary(publicId); // Delete the old thumbnail from Cloudinary
            }
               //upload thumbnail to cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path); // Upload the new thumbnail to Cloudinary
        }

        // Validate course price
        let validatedPrice = course.coursePrice; // Keep existing price if not provided
        if (coursePrice !== undefined && coursePrice !== null && coursePrice !== '') {
            const numericPrice = Number(coursePrice);
            if (!isNaN(numericPrice) && numericPrice >= 0) {
                validatedPrice = numericPrice;
            }
        }

        console.log("Validated price for update:", validatedPrice);

        const updateData ={
            courseTitle,
            subTitle,
            description,
            courseLevel,
            coursePrice: validatedPrice,
            category,
            courseThumbnail: courseThumbnail?.secure_url
        };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true }); // Update the course in the database
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to edit course"
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId; // Get the course ID from the request parameters
        const course = await Course.findById(courseId); // Find the course by ID
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get course by id"
        })
    }
}

export const createLecture = async (req, res) => {
    try {
      const { lectureTitle, description, isPreviewFree, duration, videoUrl } = req.body;
      const courseId = req.params.courseId;

      console.log("Request body:", req.body);
      console.log("Course ID:", courseId);

      if (!lectureTitle) {
        return res.status(400).json({
          success: false,
          message: "Lecture title is required."
        });
      }

      if (!courseId) {
        return res.status(400).json({
          success: false,
          message: "Course ID is required."
        });
      }

      // Find the course and verify ownership
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found."
        });
      }

      // Check if user is the course creator
      if (course.creator.toString() !== req.id) {
        console.log("Authorization failed:");
        console.log("Course creator:", course.creator.toString());
        console.log("Request user ID:", req.id);
        return res.status(403).json({
          success: false,
          message: "You are not authorized to add lectures to this course."
        });
      }

      console.log("✅ Authorization successful - User can create lecture");

      // Create a new lecture with all fields
      const lecture = await Lecture.create({
        lectureTitle,
        description: description || "",
        isPreviewFree: isPreviewFree || false,
        duration: duration || "",
        videoUrl: videoUrl || ""
      });
  
      // Add the lecture to the course
      course.lectures.push(lecture._id);
      await course.save();
  
      return res.status(201).json({
        success: true,
        message: "Lecture created successfully.",
        lecture
      });
    } catch (error) {
      console.log("Error creating lecture:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create lecture."
      });
    }
  };

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        //polulate ka kam
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Lecture fetched successfully",
            lectures: course.lectures
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get lecture"
        })
    }
}

// Get all published courses (for public viewing)
export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({
            path: "creator",
            select: "name photoUrl"
        });

        if (!courses || courses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No published courses found",
                courses: []
            });
        }

        return res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get published courses"
        });
    }
}

// Search courses with filters
export const searchCourses = async (req, res) => {
    try {
        const { query, categories, sortByPrice } = req.query;

        // Build search criteria
        let searchCriteria = { isPublished: true };

        // Add text search if query provided
        if (query) {
            searchCriteria.$or = [
                { courseTitle: { $regex: query, $options: 'i' } },
                { subTitle: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ];
        }

        // Add category filter if provided
        if (categories) {
            const categoryArray = categories.split(',');
            searchCriteria.category = { $in: categoryArray };
        }

        // Build the query
        let coursesQuery = Course.find(searchCriteria).populate({
            path: "creator",
            select: "name photoUrl"
        });

        // Add sorting if provided
        if (sortByPrice) {
            if (sortByPrice === 'low') {
                coursesQuery = coursesQuery.sort({ coursePrice: 1 });
            } else if (sortByPrice === 'high') {
                coursesQuery = coursesQuery.sort({ coursePrice: -1 });
            }
        } else {
            // Default sort by creation date (newest first)
            coursesQuery = coursesQuery.sort({ createdAt: -1 });
        }

        const courses = await coursesQuery;

        return res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to search courses"
        });
    }
}

// Get course details for public viewing (no authentication required)
export const getPublishedCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOne({
            _id: courseId,
            isPublished: true
        }).populate({
            path: "creator",
            select: "name photoUrl"
        }).populate("lectures");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found or not published"
            });
        }

        return res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get course details"
        });
    }
}

// Publish or unpublish a course
export const publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query; // Get publish status from query parameter

        // Find the course and verify ownership
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if user is the course creator
        if (course.creator.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to publish this course"
            });
        }

        // Check if course has lectures before publishing
        if (publish === 'true' && course.lectures.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot publish course without lectures"
            });
        }

        // Update the publish status
        const isPublished = publish === 'true';
        course.isPublished = isPublished;
        await course.save();

        return res.status(200).json({
            success: true,
            message: `Course ${isPublished ? 'published' : 'unpublished'} successfully`,
            course
        });

    } catch (error) {
        console.error("Publish course error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course publish status"
        });
    }
};

// Fix all courses to have valid prices
export const fixAllCoursePrices = async (req, res) => {
    try {
        console.log("Fixing all course prices...");

        // Update all courses that have null, undefined, or invalid prices
        const result = await Course.updateMany(
            {
                $or: [
                    { coursePrice: { $exists: false } },
                    { coursePrice: null },
                    { coursePrice: { $lt: 0 } },
                    { coursePrice: { $type: "string" } }
                ]
            },
            {
                $set: { coursePrice: 999 }
            }
        );

        console.log("Price fix result:", result);

        // Get all courses to verify
        const allCourses = await Course.find({}).select('courseTitle coursePrice category creator');

        return res.status(200).json({
            success: true,
            message: `Fixed ${result.modifiedCount} courses`,
            totalCourses: allCourses.length,
            courses: allCourses.map(course => ({
                id: course._id,
                title: course.courseTitle,
                price: course.coursePrice,
                category: course.category
            }))
        });

    } catch (error) {
        console.error("Fix prices error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fix course prices"
        });
    }
};

// Publish all courses that have lectures
export const publishAllCourses = async (req, res) => {
    try {
        console.log("Publishing all courses with lectures...");

        // Find all courses that have lectures but are not published
        const coursesWithLectures = await Course.find({
            lectures: { $exists: true, $not: { $size: 0 } },
            isPublished: false
        }).populate('lectures');

        let publishedCount = 0;

        for (const course of coursesWithLectures) {
            if (course.lectures.length > 0) {
                course.isPublished = true;
                await course.save();
                publishedCount++;
                console.log(`Published: ${course.courseTitle}`);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Published ${publishedCount} courses`,
            publishedCount
        });

    } catch (error) {
        console.error("Publish all courses error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to publish courses"
        });
    }
};
