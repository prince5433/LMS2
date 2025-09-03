import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  Heart,
  Share2
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course, viewMode = "grid" }) => {
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return `₹${price.toLocaleString()}`;
  };

  const getBadgeVariant = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <Link to={`/course-detail/${course._id}`} className="flex-shrink-0">
              <img
                src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"}
                alt={course.courseTitle}
                className="h-24 w-40 object-cover rounded-lg"
              />
            </Link>

            <div className="flex-1 space-y-3">
              <div>
                <Link to={`/course-detail/${course._id}`}>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2">
                    {course.courseTitle}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {course.subTitle || course.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
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
                <span className="text-xs text-gray-500">(234 reviews)</span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={course.creator?.photoUrl} />
                  <AvatarFallback className="text-xs">
                    {course.creator?.name?.charAt(0) || "I"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {course.creator?.name || "Expert Instructor"}
                </span>
                <Badge className={`${getBadgeVariant(course.courseLevel)} text-xs`}>
                  {course.courseLevel || "Beginner"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(course.coursePrice)}
                </div>
                {course.coursePrice > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    ₹{(course.coursePrice * 1.5)?.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Heart size={14} />
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 size={14} />
                </Button>
                <Link to={`/course-detail/${course._id}`}>
                  <Button size="sm" className="btn-primary">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="course-card h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 group">
      <div className="relative overflow-hidden">
        <Link to={`/course-detail/${course._id}`}>
          <img
            src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
            alt={course.courseTitle}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Play className="text-white" size={24} fill="white" />
          </div>
        </div>

        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getBadgeVariant(course.courseLevel)} font-semibold px-2 py-1`}>
            {course.courseLevel || "Beginner"}
          </Badge>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-900 font-bold">
            {formatPrice(course.coursePrice)}
          </Badge>
        </div>

        {/* Wishlist button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
            <Heart size={16} className="text-white" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Course Title */}
          <Link to={`/course-detail/${course._id}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
              {course.courseTitle}
            </h3>
          </Link>

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
                <AvatarImage src={course.creator?.photoUrl} />
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4">
            <Link to={`/course-detail/${course._id}`} className="flex-1">
              <Button className="w-full btn-primary">
                <BookOpen size={16} className="mr-2" />
                View Details
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="px-3">
              <Heart size={16} />
            </Button>
            <Button size="sm" variant="outline" className="px-3">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResult;