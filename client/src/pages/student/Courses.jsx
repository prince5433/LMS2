import React from "react";
import Course from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isError) return <h1 className="text-red-500 text-center py-10">Some error occurred while fetching courses.</h1>;

  return (
    <div className="bg-background py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center font-extrabold text-3xl md:text-4xl mb-2 animate-fade-in">
          Our Courses
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
            : data?.courses &&
            data.courses.map((course, index) => (
              <div key={course._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <Course course={course} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50">
      <Skeleton className="w-full h-40" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </div>
  );
};
