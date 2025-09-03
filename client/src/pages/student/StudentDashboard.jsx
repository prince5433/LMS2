import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  Calendar,
  Target,
  Star,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';
import { InlineLoading, CourseCardSkeleton } from '@/components/Loading';

const StudentDashboard = () => {
  const { user } = useSelector((store) => store.auth);

  // Fetch real data from APIs
  const {
    data: purchasedCoursesData,
    isLoading: purchasedLoading,
    isError: purchasedError
  } = useGetPurchasedCoursesQuery();

  const {
    data: publishedCoursesData,
    isLoading: publishedLoading,
    isError: publishedError
  } = useGetPublishedCoursesQuery();

  // Process the data
  const purchasedCourses = purchasedCoursesData?.purchasedCourses || [];
  const publishedCourses = publishedCoursesData?.courses || [];

  // Calculate real stats
  const stats = {
    enrolledCourses: purchasedCourses.length,
    completedCourses: purchasedCourses.filter(course => course.progress === 100).length,
    totalHours: purchasedCourses.reduce((total, course) => total + (course.totalHours || 0), 0),
    certificates: purchasedCourses.filter(course => course.progress === 100).length
  };

  // Get recent courses from purchased courses
  const recentCourses = purchasedCourses.slice(0, 3).map(course => ({
    id: course.courseId || course._id,
    title: course.courseTitle || course.title,
    progress: course.progress || 0,
    instructor: course.creator?.name || course.instructorName || "Instructor",
    thumbnail: course.courseThumbnail || "/api/placeholder/300/200",
    lastAccessed: course.lastAccessed || "Recently",
    courseId: course.courseId || course._id
  }));

  // If no purchased courses, show some published courses as recommendations
  const recommendedCourses = publishedCourses.slice(0, 3).map(course => ({
    id: course._id,
    title: course.courseTitle,
    progress: 0,
    instructor: course.creator?.name || "Instructor",
    thumbnail: course.courseThumbnail || "/api/placeholder/300/200",
    lastAccessed: "Not enrolled",
    courseId: course._id,
    isRecommended: true
  }));

  const achievements = [
    { title: "First Course Completed", icon: Award, date: "2 weeks ago" },
    { title: "5 Courses Enrolled", icon: Target, date: "1 week ago" },
    { title: "50 Hours Learned", icon: Clock, date: "3 days ago" }
  ];

  // Loading state
  if (purchasedLoading || publishedLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Loading your dashboard...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
          <InlineLoading message="Loading your courses..." />
        </div>
      </div>
    );
  }

  // Error state
  if (purchasedError || publishedError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
          </div>
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    Failed to load courses
                  </h3>
                  <p className="text-red-600 dark:text-red-400">
                    There was an error loading your dashboard. Please try refreshing the page.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Enrolled Courses</p>
                  <p className="text-3xl font-bold">{stats.enrolledCourses}</p>
                </div>
                <BookOpen size={32} className="text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Completed</p>
                  <p className="text-3xl font-bold">{stats.completedCourses}</p>
                </div>
                <Award size={32} className="text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Learning Hours</p>
                  <p className="text-3xl font-bold">{stats.totalHours}</p>
                </div>
                <Clock size={32} className="text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Certificates</p>
                  <p className="text-3xl font-bold">{stats.certificates}</p>
                </div>
                <Star size={32} className="text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play size={20} />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCourses.length > 0 ? (
                    recentCourses.map((course) => (
                      <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <BookOpen size={24} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {course.instructor}
                          </p>
                          {!course.isRecommended && (
                            <div className="flex items-center gap-2 mt-2">
                              <Progress value={course.progress} className="flex-1" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {course.progress}%
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {course.isRecommended ? 'Recommended for you' : `Last accessed ${course.lastAccessed}`}
                          </p>
                        </div>
                        <Link to={`/course-detail/${course.courseId}`}>
                          <Button size="sm" className="btn-primary">
                            {course.isRecommended ? 'View' : (course.progress === 100 ? 'Review' : 'Continue')}
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : recommendedCourses.length > 0 ? (
                    recommendedCourses.map((course) => (
                      <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <BookOpen size={24} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {course.instructor}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            Recommended
                          </Badge>
                        </div>
                        <Link to={`/course-detail/${course.courseId}`}>
                          <Button size="sm" variant="outline">
                            View Course
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No courses yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Start your learning journey by enrolling in a course
                      </p>
                      <Link to="/courses">
                        <Button className="btn-primary">
                          Browse Courses
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link to="/my-learning">
                    <Button variant="outline" className="w-full">
                      View All Courses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/course/search">
                  <Button className="w-full" variant="outline">
                    <BookOpen size={16} className="mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/my-learning">
                  <Button className="w-full" variant="outline">
                    <TrendingUp size={16} className="mr-2" />
                    My Learning
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button className="w-full" variant="outline">
                    <Calendar size={16} className="mr-2" />
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award size={20} />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <achievement.icon size={16} className="text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
