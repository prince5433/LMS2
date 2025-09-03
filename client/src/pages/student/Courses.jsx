



import React from 'react';
import { toast } from 'sonner';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';

function Courses() {
    const { data, isLoading, isError } = useGetPublishedCoursesQuery();

    React.useEffect(() => {
        if (isError) {
            toast.error('Some error occurred while fetching courses.');
        }
    }, [isError]);

    return (
        <div className='bg-gray-50 dark:bg-[#141414]'>
            <div className='max-w-7xl mx-auto p-6'>
                <h2 className='text-3xl font-bold mb-10 text-center dark:text-white'>Our Courses</h2>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {
                        isLoading ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <CourseSkeleton key={index} />
                            ))
                        ) : data?.courses && data.courses.length > 0 ? (
                            data.courses.map((course, index) => (
                                <Course key={index} course={course} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded">
                                    <strong>No courses available</strong>
                                    <p>There are currently no published courses.</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

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
    );
}

export default Courses;
