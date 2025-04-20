export const createCourse = async (req, res) => {
    try {
        const {courseTitle,category}=req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        //agar exisst krte hai to course create kro
        const course=await Course.create({
            courseTitle,
            category,
            creator:req.id,
        });
        return res.status(201).json({
            success:true,
            message:"Course created successfully.",
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