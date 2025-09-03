import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCreatorCoursesQuery, usePublishCourseMutation } from "@/features/api/courseApi";
import {
  Edit,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Users,
  BookOpen,
  TrendingUp,
  Filter,
  Calendar,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

const CourseTable = () => {
  const { data, isLoading, error } = useGetCreatorCoursesQuery();
  const [publishCourse] = usePublishCourseMutation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  const courses = data?.courses || [];

  // Filter courses based on search and status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "published" && course.isPublished) ||
      (filterStatus === "draft" && !course.isPublished);
    return matchesSearch && matchesStatus;
  });

  const handlePublishToggle = async (courseId, currentStatus) => {
    try {
      await publishCourse({ courseId, publish: !currentStatus }).unwrap();
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return `₹${price.toLocaleString()}`;
  };

  const getStatusBadge = (isPublished) => {
    return isPublished ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Published
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
        Draft
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error loading courses
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message || 'Something went wrong'}
            </p>
            <Button onClick={() => navigate("create")} className="btn-primary">
              <Plus size={16} className="mr-2" />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your course content
          </p>
        </div>
        <Button onClick={() => navigate("create")} className="btn-primary">
          <Plus size={16} className="mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courses.length}
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
                  Published
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courses.filter(c => c.isPublished).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{courses.reduce((acc, course) =>
                    acc + ((course.coursePrice || 0) * (course.enrolledStudents?.length || 0)), 0
                  ).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Course Management</CardTitle>
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
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("published")}>
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                    Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {courses.length === 0 ? 'No courses yet' : 'No courses found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {courses.length === 0
                  ? 'Get started by creating your first course'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {courses.length === 0 && (
                <Button onClick={() => navigate("create")} className="btn-primary">
                  <Plus size={16} className="mr-2" />
                  Create Your First Course
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                          alt={course.courseTitle}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {course.courseTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {course.lectures?.length || 0} lectures
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(course.isPublished)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        <span>{course.enrolledStudents?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(course.coursePrice)}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {course.createdAt ? format(new Date(course.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`${course._id}`)}>
                            <Edit size={14} className="mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`${course._id}/lecture`)}>
                            <BookOpen size={14} className="mr-2" />
                            Manage Lectures
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/course-detail/${course._id}`)}>
                            <Eye size={14} className="mr-2" />
                            Preview Course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handlePublishToggle(course._id, course.isPublished)}
                          >
                            <TrendingUp size={14} className="mr-2" />
                            {course.isPublished ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTable;