import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <Link
      to={`/course-detail/${course._id}`}
      className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-card border border-border/50 rounded-xl p-4 gap-4 card-hover hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={course.courseThumbnail}
            alt="course-thumbnail"
            className="h-32 w-full md:w-56 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl group-hover:text-indigo-500 transition-colors duration-300">{course.courseTitle}</h1>
          <p className="text-sm text-muted-foreground">{course.subTitle}</p>
          <p className="text-sm text-muted-foreground">
            Instructor: <span className="font-semibold text-foreground">{course.creator?.name}</span>
          </p>
          <Badge className="w-fit bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-full font-medium">
            {course.courseLevel}
          </Badge>
        </div>
      </div>
      <div className="md:text-right">
        <h1 className="font-bold text-xl gradient-text">₹{course.coursePrice}</h1>
      </div>
    </Link>
  );
};

export default SearchResult;
