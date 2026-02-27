import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, Loader2, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);

  const { data, isLoading, isError, error } = useGetCourseDetailWithStatusQuery(courseId, {
    skip: !courseId || !isValidObjectId
  });

  if (!courseId) return <h1 className="text-center py-20 text-xl">No course ID provided</h1>;
  if (!isValidObjectId) return <h1 className="text-center py-20 text-xl text-red-500">Invalid course ID format</h1>;
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
    </div>
  );
  if (isError) return <h1 className="text-center py-20 text-xl text-red-500">Error: {error?.data?.message || 'Failed to load course details'}</h1>;

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`)
    }
  }

  if (!course) return <div className="text-center py-20">No course data available</div>;

  const formattedDate = course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Date not available';
  const firstLecture = course.lectures && course.lectures.length > 0 ? course.lectures[0] : null;

  return (
    <div className="space-y-5 mt-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 flex flex-col gap-3 animate-fade-in">
          <h1 className="font-extrabold text-3xl md:text-4xl">
            {course.courseTitle || 'Untitled Course'}
          </h1>
          <p className="text-lg text-indigo-200">{course.subTitle || 'Course Sub-title'}</p>
          <p className="text-gray-300">
            Created by{" "}
            <span className="text-indigo-400 font-medium">
              {course.creator?.name || 'Unknown Creator'}
            </span>
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
            <div className="flex items-center gap-1">
              <BadgeInfo size={16} />
              <span>Last updated {formattedDate}</span>
            </div>
            <span>•</span>
            <span>{course.enrolledStudents?.length || 0} students enrolled</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10 pb-10">
        <div className="w-full lg:w-1/2 space-y-6 animate-fade-in-up">
          <div>
            <h2 className="font-bold text-xl md:text-2xl mb-3">Description</h2>
            <p
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: course.description || 'No description available' }}
            />
          </div>
          <Card className="border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
              <CardDescription>{course.lectures?.length || 0} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures?.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-indigo-500">
                    {lecture.isPreviewFree ? <PlayCircle size={16} /> : <Lock size={16} />}
                  </span>
                  <p className="font-medium">{lecture.lectureTitle || `Lecture ${idx + 1}`}</p>
                </div>
              )) || <p className="text-muted-foreground">No lectures available</p>}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Card className="border border-border/50 shadow-xl sticky top-24">
            <CardContent className="p-4 flex flex-col">
              {firstLecture && (
                <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
                  <ReactPlayer
                    width="100%"
                    height={"100%"}
                    url={firstLecture.videoUrl}
                    controls={true}
                  />
                </div>
              )}
              <h1 className="font-semibold">{firstLecture?.lectureTitle || 'No lecture available'}</h1>
              <Separator className="my-3" />
              <h1 className="text-2xl font-bold">
                <span className="gradient-text">₹{course.coursePrice || 'Not set'}</span>
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full gradient-btn text-white rounded-lg h-11 font-semibold border-0">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
