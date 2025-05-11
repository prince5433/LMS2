import BuyCourseButton from '@/components/BuyCourseButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, PlayCircle } from 'lucide-react'
import React, { use } from 'react'
import { useParams } from 'react-router-dom';
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import { Lock } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
// import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';


const CourseDetail = () => {
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();
    // const purchasedCourse = false;

    const {data,isLoading,isError} = useGetCourseDetailWithStatusQuery(courseId);
    if(isLoading){
        return <h1>Loading...</h1>
    }
    if(isError){
        return <h1>Failed to load course Details...</h1>
    }

    const {course,purchased} = data;

    const handleContinueCourse = () => {
        // Logic to continue the course
       if(purchased){
            navigate(`/course-progress/${courseId}`);
       }
    }

    return (
        <div className='mt-20 space-y-5'>
            <div className='bg-[#2D2F31] text-white'>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                    <h1 className='font-bold text-2xl md:text-3xl'>{course?.courseTitle}</h1>
                    <p className='text-base md:text-lg'>Course Subtitle</p>
                    <p>Created By{" "}<span className='text-[#C0C4FC] underline italic'>{course?.creator.name}</span></p>
                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>Last updated {course?.createdAt.split("T")[0]}</p>
                    </div>
                    <p>Students Enrolled : 10</p>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-4 md:px-8 my-5 flex flex-col lg:flex-row justify-between gap-10'>
                <div className='w-full lg:w-1/2 space-y-5'>
                    <h1 className='font-bold text-2xl md:text-2xl'>Description</h1>
                    <p className='text-sm' dangerouslySetInnerHTML={{__html:course?.description}}/>
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>
                                10 Lectures
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            {
                              course.lectures.map((lecture, idx) => (
                                    <div key={idx} className='flex items-center gap-3 text-sm'>
                                        <span>
                                            {
                                                true ? (<PlayCircle size={14} />) : (<Lock size={14} />)
                                            }
                                        </span>
                                        <p>{lecture.lectureTitle}</p>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full lg:w-1/3 '>
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            <div className='w-full aspect-video mb-4'>
                                <ReactPlayer
                                    url={course.lectures[7].videoUrl}
                                    //yaha pe 0 krna hai for intro lectures
                                    controls={true}
                                    width='100%'
                                    height='100%'
                                    className='rounded-lg'
                                />
                            </div>
                            <h1>Lecture Title</h1>
                            <Separator className='my-2' />
                            <h1 className='text-lg md:text-xl font-semibold'>Course Price</h1>
                        </CardContent>
                        <CardFooter className='flex justify-center p-4'>
                            {
                                purchased ? (
                                     <Button onClick={handleContinueCourse} className='w-full'>Continue Course</Button>
                                ):(
                                    <BuyCourseButton courseId={courseId}/>
                                )
                            }
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CourseDetail