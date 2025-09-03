import React from 'react'
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Clock, Users, Star, BookOpen, Play } from 'lucide-react'

const Course = ({course}) => {
    const getBadgeVariant = (level) => {
        switch(level?.toLowerCase()) {
            case 'beginner': return 'bg-green-500 hover:bg-green-600'
            case 'intermediate': return 'bg-yellow-500 hover:bg-yellow-600'
            case 'advanced': return 'bg-red-500 hover:bg-red-600'
            default: return 'bg-blue-500 hover:bg-blue-600'
        }
    }

    const formatPrice = (price) => {
        if (!price || price === 0) return 'Free'
        return `₹${price.toLocaleString()}`
    }

    return (
        <Link to={`/course-detail/${course._id}`} className="block group">
            <Card className="course-card h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 group-hover:-translate-y-1">
                <div className="relative overflow-hidden">
                    <img
                        src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={course.courseTitle}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay with play button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <Play className="text-white" size={24} fill="white" />
                        </div>
                    </div>

                    {/* Level badge */}
                    <div className="absolute top-3 left-3">
                        <Badge className={`${getBadgeVariant(course.courseLevel)} text-white font-semibold px-2 py-1`}>
                            {course.courseLevel || "Beginner"}
                        </Badge>
                    </div>

                    {/* Price badge */}
                    <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-gray-900 font-bold">
                            {formatPrice(course.coursePrice)}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Course Title */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                            {course.courseTitle}
                        </h3>

                        {/* Course Subtitle */}
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {course.subTitle || "Master new skills with this comprehensive course"}
                        </p>

                        {/* Course Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <BookOpen size={14} />
                                <span>{course.lectures?.length || 0} lectures</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{course.enrolledStudents?.length || 0} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>2h 30m</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={14}
                                        className="text-yellow-400 fill-current"
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">4.8</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">(234 reviews)</span>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={course.creator?.photoUrl || "https://github.com/shadcn.png"} />
                                    <AvatarFallback className="text-xs">
                                        {course.creator?.name?.charAt(0) || "I"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {course.creator?.name || "Expert Instructor"}
                                </span>
                            </div>

                            {/* Category */}
                            <Badge variant="outline" className="text-xs">
                                {course.category || "General"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Course;
