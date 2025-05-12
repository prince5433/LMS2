import React from 'react'
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'

const Course = ({course}) => {
    return (
        <Link to={`/course-detail/${course._id}`}>
            <Card className="course-card dark:bg-gray-800 dark:text-white shadow-lg hover:shadow-2xl transform hover:scale=105 transition-all duration-300 rounded-lg overflow-hidden">
                <div className="relative">
                    <img
                        src={course.courseThumbnail || "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"}
                        alt={course.courseTitle}
                        className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <Badge className="bg-green-500 hover:bg-green-600">{course.courseLevel || "Beginner"}</Badge>
                    </div>
                </div>
                <CardContent className="p-4 dark:bg-gray-800">
                    <h3 className="text-lg font-bold mb-2 dark:text-white">{course.courseTitle}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">{course.subTitle || "Learn something new today"}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={course.creator?.photoUrl || "https://github.com/shadcn.png"} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500 dark:text-gray-300">{course.creator?.name || "Instructor"}</span>
                        </div>
                        <span className="font-bold dark:text-white">₹{course.coursePrice || "Free"}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Course;
