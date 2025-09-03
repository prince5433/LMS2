import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";

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

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId; // Get the course ID from the request parameters
        const {courseTitle,subTitle,description,courseLevel,coursePrice,category} = req.body;
        const thumbnail =req.file;

        let course= await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
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
        const updateData ={courseTitle,subTitle,description,courseLevel,coursePrice,category,courseThumbnail: courseThumbnail?.secure_url};
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
      const { lectureTitle } = req.body;
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
  
      // Find the course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found."
        });
      }
  
      // Create a new lecture
      const lecture = await Lecture.create({
        lectureTitle,
        isPreviewFree: false
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
