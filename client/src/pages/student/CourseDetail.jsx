import BuyCourseButton from '@/components/BuyCourseButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BadgeInfo,
  PlayCircle,
  Lock,
  Clock,
  Users,
  Star,
  Calendar,
  BookOpen,
  Award,
  Globe,
  Download,
  Share2,
  Heart,
  CheckCircle,
  Video,
  FileText,
  Target,
  TrendingUp
} from 'lucide-react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';

const CourseDetail = () => {
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [isWishlisted, setIsWishlisted] = useState(false);

    const {data, isLoading, isError} = useGetCourseDetailWithStatusQuery(courseId);

    if(isLoading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
                </div>
            </div>
        );
    }

    if(isError){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <BookOpen size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load course details</p>
                    <Button onClick={() => navigate('/course/search')} variant="outline">
                        Browse Other Courses
                    </Button>
                </div>
            </div>
        );
    }

    const {course, purchased} = data;

    const handleContinueCourse = () => {
        if(purchased){
            navigate(`/course-progress/${courseId}`);
        }
    }

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        // TODO: Implement wishlist API call
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        // TODO: Add toast notification
    }

    // Format the date safely with a fallback
    const formattedDate = course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A";

    // Mock data for enhanced features
    const courseStats = {
        totalStudents: 1250,
        rating: 4.7,
        totalReviews: 324,
        totalDuration: "12h 30m",
        language: "English",
        level: course?.courseLevel || "Beginner",
        lastUpdated: formattedDate,
        certificate: true
    };

    const reviews = [
        {
            id: 1,
            name: "John Doe",
            rating: 5,
            comment: "Excellent course! Very well structured and easy to follow.",
            date: "2 weeks ago",
            avatar: "/api/placeholder/40/40"
        },
        {
            id: 2,
            name: "Jane Smith",
            rating: 4,
            comment: "Great content, but could use more practical examples.",
            date: "1 month ago",
            avatar: "/api/placeholder/40/40"
        }
    ];

    const requirements = [
        "Basic computer knowledge",
        "No prior programming experience required",
        "Willingness to learn and practice"
    ];

    const whatYouWillLearn = [
        "Master the fundamentals of the subject",
        "Build real-world projects",
        "Understand best practices and industry standards",
        "Get hands-on experience with tools and technologies"
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        {course?.category || "Programming"}
                                    </Badge>
                                    <Badge variant="outline" className="text-white border-white">
                                        {courseStats.level}
                                    </Badge>
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                                    {course?.courseTitle}
                                </h1>

                                <p className="text-xl text-blue-100 leading-relaxed">
                                    {course?.subTitle || "Master the skills you need to succeed in today's digital world"}
                                </p>
                            </div>

                            {/* Course Stats */}
                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Star className="text-yellow-400 fill-current" size={16} />
                                    <span className="font-semibold">{courseStats.rating}</span>
                                    <span className="text-blue-200">({courseStats.totalReviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>{courseStats.totalStudents.toLocaleString()} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{courseStats.totalDuration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={16} />
                                    <span>{courseStats.language}</span>
                                </div>
                            </div>

                            {/* Instructor Info */}
                            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={course?.creator?.photoUrl} />
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {course?.creator?.name?.charAt(0) || "I"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-blue-200">Created by</p>
                                    <p className="font-semibold text-lg">{course?.creator?.name || "Expert Instructor"}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleWishlist}
                                    className="text-white border-white hover:bg-white hover:text-blue-900"
                                >
                                    <Heart size={16} className={`mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                    className="text-white border-white hover:bg-white hover:text-blue-900"
                                >
                                    <Share2 size={16} className="mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* Course Preview Card */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardContent className="p-0">
                                    <div className="aspect-video relative">
                                        {course?.lectures?.length > 0 ? (
                                            <ReactPlayer
                                                url={course.lectures[0].videoUrl}
                                                controls={true}
                                                width="100%"
                                                height="100%"
                                                className="rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                                                <Video size={48} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                                ₹{course?.coursePrice || "999"}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                One-time payment
                                            </p>
                                        </div>

                                        {purchased ? (
                                            <Button onClick={handleContinueCourse} className="w-full h-12 text-lg">
                                                <PlayCircle size={20} className="mr-2" />
                                                Continue Learning
                                            </Button>
                                        ) : (
                                            <BuyCourseButton courseId={courseId} />
                                        )}

                                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                            <p>30-Day Money-Back Guarantee</p>
                                        </div>

                                        {/* Course Includes */}
                                        <div className="space-y-3 pt-4 border-t">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">This course includes:</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Video size={16} className="text-blue-600" />
                                                    <span>{course?.lectures?.length || 0} video lectures</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Download size={16} className="text-blue-600" />
                                                    <span>Downloadable resources</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award size={16} className="text-blue-600" />
                                                    <span>Certificate of completion</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-blue-600" />
                                                    <span>Lifetime access</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs Navigation */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                {/* What You'll Learn */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target size={20} className="text-blue-600" />
                                            What you'll learn
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {whatYouWillLearn.map((item, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                                                    <span className="text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Course Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Course Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="prose prose-sm max-w-none dark:prose-invert"
                                            dangerouslySetInnerHTML={{__html: course?.description || "No description available."}}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Requirements */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Requirements</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {requirements.map((req, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-sm">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Curriculum Tab */}
                            <TabsContent value="curriculum">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen size={20} className="text-blue-600" />
                                            Course Content
                                        </CardTitle>
                                        <CardDescription>
                                            {course?.lectures?.length || 0} lectures • {courseStats.totalDuration}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {course?.lectures?.map((lecture, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                                                    {purchased ? (
                                                        <PlayCircle size={16} className="text-blue-600" />
                                                    ) : (
                                                        <Lock size={16} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {lecture.lectureTitle}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Video • 15 min
                                                    </p>
                                                </div>
                                                {!purchased && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Preview
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Instructor Tab */}
                            <TabsContent value="instructor">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About the Instructor</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={course?.creator?.photoUrl} />
                                                <AvatarFallback className="bg-blue-600 text-white text-xl">
                                                    {course?.creator?.name?.charAt(0) || "I"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {course?.creator?.name || "Expert Instructor"}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Professional Developer & Educator
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">4.8</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">15K</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">25</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Courses</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">5+</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                An experienced developer and educator with over 5 years of industry experience.
                                                Passionate about teaching and helping students achieve their goals in technology.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Reviews Tab */}
                            <TabsContent value="reviews">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Star size={20} className="text-yellow-500" />
                                            Student Reviews
                                        </CardTitle>
                                        <CardDescription>
                                            {courseStats.rating} average rating • {courseStats.totalReviews} reviews
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Rating Overview */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                                    {courseStats.rating}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={16}
                                                            className={`${star <= Math.floor(courseStats.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Course Rating
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                    <div key={rating} className="flex items-center gap-3">
                                                        <span className="text-sm w-8">{rating}★</span>
                                                        <Progress value={rating === 5 ? 70 : rating === 4 ? 20 : 5} className="flex-1" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                                            {rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Individual Reviews */}
                                        <div className="space-y-6">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="space-y-3">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar>
                                                            <AvatarImage src={review.avatar} />
                                                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                                    {review.name}
                                                                </h4>
                                                                <div className="flex items-center gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            size={12}
                                                                            className={`${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {review.date}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                                {review.comment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Course Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Course Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
                                        <Badge variant="outline">{courseStats.level}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                                        <span className="text-sm font-medium">{courseStats.totalDuration}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Language</span>
                                        <span className="text-sm font-medium">{courseStats.language}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                                        <span className="text-sm font-medium">{courseStats.lastUpdated}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Certificate</span>
                                        <div className="flex items-center gap-1">
                                            <Award size={14} className="text-green-600" />
                                            <span className="text-sm font-medium text-green-600">Yes</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Courses */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Related Courses</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                            <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                                <BookOpen size={16} className="text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                                    Advanced React Development
                                                </h4>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star size={12} className="text-yellow-400 fill-current" />
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">4.8</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail