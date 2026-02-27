import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();

  const myLearning = data?.user.enrolledCourses || [];
  return (
    <div className="max-w-7xl mx-auto my-24 px-4 md:px-8">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-extrabold text-3xl md:text-4xl mb-2">My Learning</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
      </div>

      <div>
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold mb-2 text-muted-foreground">No courses yet</h2>
            <p className="text-muted-foreground">Start exploring and enroll in courses to begin your learning journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myLearning.map((course, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <Course course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div
        key={index}
        className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-md"
      >
        <div className="h-40 bg-muted animate-pulse" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
        </div>
      </div>
    ))}
  </div>
);
