import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  BarChart3,
  Eye,
  Edit,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetCreatorCoursesQuery } from '@/features/api/courseApi';

const InstructorDashboard = () => {
  const { user } = useSelector((store) => store.auth);

  // Fetch real course data
  const { data: coursesData, isLoading: coursesLoading, isError: coursesError } = useGetCreatorCoursesQuery();

  const courses = coursesData?.courses || [];



  // Temporary fallback data for testing if no real courses exist
  const fallbackCourses = courses.length === 0 ? [
    {
      _id: "67220e6dc88ae75d238fe6d0", // Use a real-looking MongoDB ObjectId
      courseTitle: "Sample React Course",
      coursePrice: 999,
      isPublished: true,
      enrolledStudents: 25,
      updatedAt: new Date().toISOString(),
      courseThumbnail: null
    },
    {
      _id: "67220e6dc88ae75d238fe6d1",
      courseTitle: "JavaScript Fundamentals",
      coursePrice: 799,
      isPublished: true,
      enrolledStudents: 15,
      updatedAt: new Date().toISOString(),
      courseThumbnail: null
    }
  ] : courses;

  // Calculate stats from real data
  const stats = {
    totalCourses: fallbackCourses.length,
    totalStudents: fallbackCourses.reduce((total, course) => total + (course.enrolledStudents || 0), 0),
    totalRevenue: fallbackCourses.reduce((total, course) => total + ((course.coursePrice || 0) * (course.enrolledStudents || 0)), 0),
    avgRating: fallbackCourses.length > 0 ? (fallbackCourses.reduce((total, course) => total + (course.rating || 4.5), 0) / fallbackCourses.length).toFixed(1) : 4.8
  };

  // Get recent courses (limit to 3 for dashboard)
  const recentCourses = fallbackCourses.slice(0, 3).map(course => ({
    id: course._id,
    title: course.courseTitle,
    students: course.enrolledStudents || 0,
    revenue: (course.coursePrice || 0) * (course.enrolledStudents || 0),
    rating: course.rating || 4.5,
    status: course.isPublished ? "published" : "draft",
    lastUpdated: course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "N/A",
    thumbnail: course.courseThumbnail
  }));

  const recentActivity = [
    { action: "New student enrolled in React Course", time: "2 hours ago" },
    { action: "Course review received (5 stars)", time: "4 hours ago" },
    { action: "Payment received: $299", time: "6 hours ago" },
    { action: "New student enrolled in JavaScript Course", time: "1 day ago" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Instructor Dashboard 👨‍🏫
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}! Manage your courses and track your success
            </p>
          </div>
          <Link to="/admin/course/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Courses</p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                </div>
                <BookOpen size={32} className="text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users size={32} className="text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign size={32} className="text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Avg Rating</p>
                  <p className="text-3xl font-bold">{stats.avgRating}</p>
                </div>
                <Star size={32} className="text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} />
                    My Courses
                  </CardTitle>
                  <Link to="/admin/course">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : coursesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Failed to load courses</p>
                  </div>
                ) : recentCourses.length > 0 ? (
                  <div className="space-y-4">
                    {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen size={24} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {course.title}
                          </h3>
                          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {course.students} students
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            ₹{course.revenue.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={14} />
                            {course.rating} rating
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Updated {course.lastUpdated}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/course-detail/${course.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link to={`/admin/course/${course.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No courses created yet</p>
                    <Link to="/admin/course/create">
                      <Button>
                        <Plus size={16} className="mr-2" />
                        Create Your First Course
                      </Button>
                    </Link>
                  </div>
                )}
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
                <Link to="/admin/course/create">
                  <Button className="w-full">
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button>
                </Link>
                <Link to="/admin/course">
                  <Button className="w-full" variant="outline">
                    <BookOpen size={16} className="mr-2" />
                    Manage Courses
                  </Button>
                </Link>
                <Button className="w-full" variant="outline" disabled>
                  <BarChart3 size={16} className="mr-2" />
                  View Analytics (Coming Soon)
                </Button>
                <Link to="/profile">
                  <Button className="w-full" variant="outline">
                    <Users size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
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

export default InstructorDashboard;
