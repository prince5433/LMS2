import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Course from "./Course"
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi'

function Courses() {
    const {data, isLoading, isError} = useGetPublishedCoursesQuery()
    
    if(isError) return <h1>Some Error Occurred While Fetching Courses</h1>
    
    return (
        <div className='bg-gray-50 dark:bg-[#141414]'>
            <div className='max-w-7xl mx-auto p-6'>
                <h2 className='text-3xl font-bold mb-10 text-center dark:text-white'>Our Courses</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {
                        isLoading ? Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} />
                        )) : (
                           data?.courses && data.courses.map((course, index) => (
                                <Course key={index} course={course} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}

// Update the CourseSkeleton component to have dark mode styling
function CourseSkeleton() {
    return (
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Skeleton className="h-40 w-full dark:bg-gray-700" />
            <div className="p-4 dark:bg-gray-800">
                <Skeleton className="h-6 w-3/4 mb-2 dark:bg-gray-700" />
                <Skeleton className="h-4 w-full mb-4 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6 rounded-full dark:bg-gray-700" />
                        <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                    </div>
                    <Skeleton className="h-4 w-12 dark:bg-gray-700" />
                </div>
            </div>
        </div>
    )
}

export default Courses
