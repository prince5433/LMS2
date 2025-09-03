import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  Calendar,
  Award,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { data: purchaseData, isLoading: purchaseLoading, isError: purchaseError } = useGetPurchasedCoursesQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetCreatorCoursesQuery();

  if (purchaseLoading || coursesLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (purchaseError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error loading dashboard data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Failed to load purchase data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const purchasedCourse = purchaseData?.purchasedCourse || [];
  const courses = coursesData?.courses || [];

  // Calculate metrics
  const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
  const totalSales = purchasedCourse.length;
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(course => course.isPublished).length;
  const totalStudents = courses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0);

  // Prepare chart data
  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId?.courseTitle || 'Unknown Course',
    price: course.courseId?.coursePrice || 0,
    sales: 1
  }));

  // Monthly revenue data (mock data - replace with actual monthly data)
  const monthlyData = [
    { month: 'Jan', revenue: totalRevenue * 0.1, students: totalStudents * 0.1 },
    { month: 'Feb', revenue: totalRevenue * 0.15, students: totalStudents * 0.15 },
    { month: 'Mar', revenue: totalRevenue * 0.2, students: totalStudents * 0.2 },
    { month: 'Apr', revenue: totalRevenue * 0.25, students: totalStudents * 0.25 },
    { month: 'May', revenue: totalRevenue * 0.3, students: totalStudents * 0.3 },
    { month: 'Jun', revenue: totalRevenue * 1, students: totalStudents * 1 }
  ];

  // Course performance data
  const coursePerformance = courses.slice(0, 5).map(course => ({
    name: course.courseTitle,
    students: course.enrolledStudents?.length || 0,
    revenue: (course.coursePrice || 0) * (course.enrolledStudents?.length || 0)
  }));

  // Category distribution (mock data)
  const categoryData = [
    { name: 'Web Development', value: 35, color: '#8884d8' },
    { name: 'Data Science', value: 25, color: '#82ca9d' },
    { name: 'Mobile Development', value: 20, color: '#ffc658' },
    { name: 'UI/UX Design', value: 15, color: '#ff7300' },
    { name: 'Others', value: 5, color: '#00ff00' }
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your course performance and student engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar size={16} className="mr-2" />
            Last 30 days
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Download PDF Report</DropdownMenuItem>
              <DropdownMenuItem>Export to CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
          color="bg-green-500"
        />
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+8.2%"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Courses"
          value={totalCourses}
          icon={BookOpen}
          trend="up"
          trendValue="+3"
          color="bg-purple-500"
        />
        <StatCard
          title="Course Sales"
          value={totalSales}
          icon={TrendingUp}
          trend="up"
          trendValue="+15.3%"
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Course Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Top Performing Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursePerformance.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {course.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {course.students} students enrolled
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ₹{course.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
            {coursePerformance.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No course data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Create New Course</h3>
                <p className="text-blue-100 text-sm">Start building your next course</p>
              </div>
              <BookOpen className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                <p className="text-green-100 text-sm">Detailed performance insights</p>
              </div>
              <TrendingUp className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Student Feedback</h3>
                <p className="text-purple-100 text-sm">Review course ratings</p>
              </div>
              <Award className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;