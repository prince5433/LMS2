import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGetCourseByIdQuery } from '@/features/api/courseApi'
import {
  ArrowLeft,
  BookOpen,
  Users,
  Eye,
  Settings,
  BarChart3,
  PlayCircle,
  DollarSign
} from 'lucide-react'
import CourseTab from './CourseTab'
import { toast } from 'sonner'

const EditCourse = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useGetCourseByIdQuery(courseId)

  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load course details')
    }
  }, [error])

  const course = data?.course

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The course you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate('/admin/course')}>
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/course')}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Course
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your course content and settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/course-detail/${courseId}`}>
            <Button variant="outline" size="sm">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </Link>
          <Link to="lecture">
            <Button className="btn-primary">
              <BookOpen size={16} className="mr-2" />
              Manage Lectures
            </Button>
          </Link>
        </div>
      </div>

      {/* Course Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Students Enrolled
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {course.enrolledStudents?.length || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Lectures
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {course.lectures?.length || 0}
                </p>
              </div>
              <PlayCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Course Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{((course.coursePrice || 0) * (course.enrolledStudents?.length || 0)).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <Badge className={course.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              {course.courseTitle}
            </CardTitle>
            <Badge variant="outline">
              {course.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <img
                src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                alt={course.courseTitle}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Course Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {course.description || course.subTitle || 'No description available'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Level:</span>
                  <p className="text-gray-600 dark:text-gray-300">{course.courseLevel || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Price:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {course.coursePrice ? `₹${course.coursePrice.toLocaleString()}` : 'Free'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Created:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Updated:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Tabs */}
      <CourseTab />
    </div>
  )
}

export default EditCourse