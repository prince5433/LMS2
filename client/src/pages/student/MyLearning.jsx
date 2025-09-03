import React from 'react'
import { useLoadUserQuery } from '@/features/api/authApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  Award,
  Play,
  Target,
  Star,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

function MyLearning() {
  const { data, isLoading } = useLoadUserQuery();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  const user = data?.user;
  const myLearning = user?.enrolledCourses || [];

  // Filter courses based on search and status
  const filteredCourses = myLearning.filter(course => {
    const matchesSearch = course.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "in-progress" && getProgress(course) > 0 && getProgress(course) < 100) ||
      (filterStatus === "completed" && getProgress(course) === 100) ||
      (filterStatus === "not-started" && getProgress(course) === 0);
    return matchesSearch && matchesStatus;
  });

  // Mock function to get course progress (you'll need to implement this based on your data structure)
  const getProgress = () => {
    // This is a mock implementation - replace with actual progress calculation
    return Math.floor(Math.random() * 101);
  };

  const stats = {
    totalCourses: myLearning.length,
    completedCourses: myLearning.filter(course => getProgress(course) === 100).length,
    inProgressCourses: myLearning.filter(course => getProgress(course) > 0 && getProgress(course) < 100).length,
    totalHours: myLearning.length * 2.5, // Mock calculation
    certificatesEarned: myLearning.filter(course => getProgress(course) === 100).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <MyLearningSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Learning Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress and continue your learning journey
            </p>
          </div>
          <Button onClick={() => navigate('/course/search?query=')} className="btn-primary">
            <BookOpen size={16} className="mr-2" />
            Browse Courses
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalCourses}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.inProgressCourses}
                  </p>
                </div>
                <Play className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completedCourses}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Learning Hours
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalHours}h
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Certificates
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.certificatesEarned}
                  </p>
                </div>
                <Star className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Continue Learning</h3>
                  <p className="text-blue-100 text-sm">Pick up where you left off</p>
                </div>
                <Play className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">View Certificates</h3>
                  <p className="text-green-100 text-sm">Download your achievements</p>
                </div>
                <Award className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Learning Goals</h3>
                  <p className="text-purple-100 text-sm">Set and track your goals</p>
                </div>
                <Target className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl">My Courses</CardTitle>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter size={16} className="mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Progress</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                      All Courses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("not-started")}>
                      Not Started
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("in-progress")}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                {myLearning.length === 0 ? (
                  <>
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No courses enrolled yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Button onClick={() => navigate('/course/search?query=')} className="btn-primary">
                      <BookOpen size={16} className="mr-2" />
                      Browse Courses
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No courses found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course, index) => (
                  <CourseCard key={index} course={course} progress={getProgress(course)} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Course Card Component
const CourseCard = ({ course, progress }) => {
  const navigate = useNavigate();

  const getStatusBadge = (progress) => {
    if (progress === 0) return <Badge variant="outline">Not Started</Badge>;
    if (progress < 100) return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/course-progress/${course._id}`)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <img
            src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
            alt={course.courseTitle}
            className="w-20 h-20 rounded-lg object-cover"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {course.courseTitle}
              </h3>
              {getStatusBadge(progress)}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {course.subTitle || course.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen size={14} />
                <span>{course.lectures?.length || 0} lectures</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>2h 30m</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="btn-primary">
              {progress === 0 ? 'Start' : progress === 100 ? 'Review' : 'Continue'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate(`/course-detail/${course._id}`)}>
                  View Details
                </DropdownMenuItem>
                {progress === 100 && (
                  <DropdownMenuItem>
                    Download Certificate
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  Remove from Learning
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyLearning;

// Enhanced Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="space-y-8">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);