import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="group overflow-hidden rounded-xl dark:bg-gray-800/50 bg-white shadow-md hover:shadow-2xl card-hover border border-border/50 hover:border-indigo-500/30 transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={course.courseThumbnail}
            alt="course"
            className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className="font-bold text-lg truncate group-hover:text-indigo-500 transition-colors duration-300">
            {course.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-indigo-500/20">
                <AvatarImage
                  src={
                    course.creator?.photoUrl ||
                    "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm text-muted-foreground">
                {course.creator?.name}
              </h1>
            </div>
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-1 text-xs rounded-full font-medium">
              {course.courseLevel}
            </Badge>
          </div>
          <div className="text-lg font-bold">
            <span className="gradient-text">₹{course.coursePrice}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
