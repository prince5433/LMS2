import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import React, { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/Textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
// import { usePublishCourseMutation } from '@/features/api/courseApi'


const CourseTab = () => {
    // const isPublished = true; // Dummy variable to check if the course is published or not
    // const isLoading = false; // Dummy variable to check if the course is loading or not

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        courseLevel: "",
        coursePrice: "",
        category: "",
        courseThumbnail: "",
    });

    const params=useParams();
    const courseId=params.courseId;

    const {data:courseByIdData,isLoading:courseByIdLoading,refetch}=useGetCourseByIdQuery(courseId);

    const [publishCourse, {  }] = usePublishCourseMutation();

 

    useEffect(() => {
        if (courseByIdData?.course) {
            const course=courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                category: course.category,
                courseThumbnail: course.courseThumbnail,
            });
            setPreviewThumbnail(course.courseThumbnail);
        }
    }, [courseByIdData]);

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const navigate = useNavigate();


    const [editCourse, { isLoading, data, isSuccess, error }] = useEditCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    }

    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    }
    //get file
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }

    const updateCourseHandler = async () => {
        // Add your update course logic here
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("category", input.category);
        formData.append("courseThumbnail", input.courseThumbnail);
        await editCourse({formData,courseId});
    }

      const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({courseId, query:action});
      if(response.data){
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course Updated Successfully");
        }
        if (error) {
            toast.error(error.data.message || "Course Update Failed");
        }
    }
        , [isSuccess, error]);
        
        if(courseByIdLoading) return <h1 className='text-center text-2xl font-bold'>Loading...</h1>

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make Changes to your courses here. Click save when you are done.
                    </CardDescription>
                </div>
                <div className="flex items-center">
                    <Button 
                    onClick={ () => publishStatusHandler(courseByIdData?.course.isPublished? "false" : "true")}
                    disabled={courseByIdData?.course.lectures.length===0}//agr course me lectures nahi hain to publish button disable kr do
                    variant="outline" className="mr-2">
                        {courseByIdData?.course.isPublished? "Unpublish" : "Publish"}
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>
                            Title
                        </Label>
                        <Input
                            type='text'
                            placeholder='Example: NextJS for Beginners'
                            name='courseTitle'
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label>
                            SubTitle
                        </Label>
                        <Input
                            type='text'
                            placeholder='Example: Learn NextJS from Scratch'
                            name='subTitle'
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label>
                            Description
                        </Label>
                        <Textarea
                            placeholder="Describe your course in detail"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            className="mt-2 min-h-[150px]"
                        />
                    </div>
                    <div className='flex items-center gap-4'>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory} >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="NextJS">NextJS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="FrontEnd Development">FrontEnd Development</SelectItem>
                                        <SelectItem value="Backend Development">Backend Development</SelectItem>
                                        <SelectItem value="FullStack Development">FullStack Development</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type='number'
                                placeholder='Example: 1000'
                                name='coursePrice'
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Thumbnail</Label>
                        <Input
                            type='file'
                            accept='image/*'
                            name='courseThumbnail'
                            onChange={selectThumbnail}
                            className="w-fit mt-2"
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} alt="Course Thumbnail" className="mt-2 w-32 h-32 object-cover" />
                            )
                        }
                    </div>
                    <div>
                        <Button variant="outline" onClick={() => navigate("/admin/course")}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler} className="ml-2">
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please Wait
                                    </>
                                ) : (
                                    "Save Changes"
                                )
                            }
                        </Button>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab