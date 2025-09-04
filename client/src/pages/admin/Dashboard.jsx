import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetInstructorStatsQuery } from "@/features/api/purchaseApi";
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useGetInstructorStatsQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetCreatorCoursesQuery();

  if (statsLoading || coursesLoading) {
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

  if (statsError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error loading dashboard data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Failed to load instructor stats. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const courses = coursesData?.courses || [];
  const stats = statsData?.stats || {};



  // Calculate metrics from instructor stats API
  const totalRevenue = stats.totalRevenue || 0;
  const totalSales = stats.totalSales || 0;
  const totalCourses = stats.totalCourses || courses.length;
  const totalStudents = stats.totalStudents || 0;
  const publishedCourses = courses.filter(course => course.isPublished).length;
  const recentSales = stats.recentSales || [];
  const revenueByCourse = stats.revenueByCourse || {};
  const salesByMonth = stats.salesByMonth || {};

  // Check if instructor has any sales data
  const hasSalesData = totalRevenue > 0 || totalSales > 0 || Object.keys(revenueByCourse).length > 0;

  // Prepare chart data from real instructor stats
  const courseData = Object.entries(revenueByCourse).map(([courseName, revenue]) => ({
    name: courseName,
    revenue: revenue,
    sales: recentSales.filter(sale => sale.courseName === courseName).length
  }));

  // Monthly revenue data from real sales data
  const monthlyData = Object.entries(salesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      revenue: revenue,
      students: Math.floor(revenue / 1000) // Estimate students based on revenue
    }));

  // If no monthly data, create some sample data
  if (monthlyData.length === 0) {
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: totalRevenue * (0.1 + i * 0.15),
        students: Math.floor(totalStudents * (0.1 + i * 0.15))
      });
    }
  }

  // Course performance data from real revenue data
  const coursePerformance = Object.entries(revenueByCourse)
    .slice(0, 5)
    .map(([courseName, revenue]) => ({
      name: courseName,
      revenue: revenue,
      students: recentSales.filter(sale => sale.courseName === courseName).length
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

      {/* No Sales Message */}
      {!hasSalesData && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                No Sales Yet
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                You haven't made any sales yet. Once students start purchasing your courses, you'll see revenue data and analytics here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/admin/course/create')} className="bg-blue-600 hover:bg-blue-700">
                  <BookOpen size={16} className="mr-2" />
                  Create Your First Course
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/course')} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  <Eye size={16} className="mr-2" />
                  Manage Existing Courses
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/course/search?query=')}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Users size={16} className="mr-2" />
                  View as Student (Test Purchase)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            {hasSalesData ? (
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-center">
                <div>
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Revenue Data Yet
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Revenue trends will appear here once you start making sales
                  </p>
                </div>
              </div>
            )}
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
        <Card
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/admin/course/create')}
        >
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

        <Card
          className="bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/admin/course')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Manage Courses</h3>
                <p className="text-green-100 text-sm">View and edit your courses</p>
              </div>
              <TrendingUp className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            // Show student statistics
            const totalStudentsCount = courses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0);
            const totalCoursesCount = courses.length;
            const avgStudentsPerCourse = totalCoursesCount > 0 ? (totalStudentsCount / totalCoursesCount).toFixed(1) : 0;

            alert(`📊 Student Statistics:\n\n` +
                  `Total Students: ${totalStudentsCount}\n` +
                  `Total Courses: ${totalCoursesCount}\n` +
                  `Average Students per Course: ${avgStudentsPerCourse}\n` +
                  `Total Revenue: ₹${totalRevenue.toLocaleString()}\n\n` +
                  `💡 Tip: Create more engaging content to attract more students!`);
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Student Insights</h3>
                <p className="text-purple-100 text-sm">View student statistics</p>
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