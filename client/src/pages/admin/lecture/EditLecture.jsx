import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlayCircle, Clock, Eye, Users, BarChart3 } from "lucide-react";
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetLectureByIdQuery, useGetCourseByIdQuery } from "@/features/api/courseApi";
import { toast } from "sonner";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const { data: lectureData, isLoading: lectureLoading, error: lectureError } = useGetLectureByIdQuery(lectureId);
  const { data: courseData } = useGetCourseByIdQuery(courseId);

  React.useEffect(() => {
    if (lectureError) {
      toast.error('Failed to load lecture details');
    }
  }, [lectureError]);

  const lecture = lectureData?.lecture;
  const course = courseData?.course;

  if (lectureLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Lecture not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The lecture you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate(`/admin/course/${courseId}/lecture`)}>
            Back to Lectures
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button size="icon" variant="outline" className="rounded-full">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Lecture
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your lecture content and settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Lecture Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,234
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Duration
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lecture.duration || 'N/A'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  87%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Access Type
                </p>
                <Badge className={lecture.isPreviewFree ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  {lecture.isPreviewFree ? 'Free Preview' : 'Premium'}
                </Badge>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lecture Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PlayCircle size={20} />
              {lecture.lectureTitle}
            </CardTitle>
            <Badge variant="outline">
              {course?.courseTitle}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                {lecture.videoUrl ? (
                  <video
                    src={lecture.videoUrl}
                    className="w-full h-full object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <PlayCircle size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No video uploaded</p>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Lecture Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {lecture.description || 'No description available'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Duration:</span>
                  <p className="text-gray-600 dark:text-gray-300">{lecture.duration || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Free Preview:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {lecture.isPreviewFree ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Created:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {lecture.createdAt ? new Date(lecture.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Updated:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {lecture.updatedAt ? new Date(lecture.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lecture Tabs */}
      <LectureTab />
    </div>
  );
};

export default EditLecture;