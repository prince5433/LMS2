import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";
// import { deleteMedia } from "../utils/cloudinary.js";

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

  export const getCourseLecture =async (req,res)=>{
    try {
        const {courseId} = req.params;
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

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, isPreviewFree ,videoInfo} = req.body;
        const { lectureId,courseId } = req.params;
        const lecture =await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        //update lecture
        if(lectureTitle) {
            lecture.lectureTitle = lectureTitle;
        }
        if(videoInfo.videoUrl) {
            lecture.videoUrl = videoInfo.videoUrl;
        }
        if(videoInfo.publicId) {
            lecture.publicId = videoInfo.publicId;
        }
        if (isPreviewFree) {
            lecture.isPreviewFree = isPreviewFree;
        }

        await lecture.save(); // Save the updated lecture to the database

        //ensure the course still has the lectureid if it was not already added;
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lectureId)) {
            course.lectures.push(lectureId);
            await course.save();
        };
        return res.status(200).json({
            success: true,
            message: "Lecture updated successfully.",
            lecture
        });

       
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update lecture."
        });
    }
};

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);//de;ete ke bad return bhi krta hai
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }
        //delete the lecture from cloudinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        //Remove the lecture reference from the associated course
        await Course.updateOne(
            { lectures: lectureId },//find the course that contains the lecture
            { $pull: { lectures: lectureId } }//remove the lecture from the course
            //pull operator is used to remove the first matching value from an array
        );
        return res.status(200).json({
            success: true,
            message: "Lecture removed successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove lecture."
        });
    }
};

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Lecture fetched successfully.",
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get lecture by id."
        });
    }
}






