import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSearchCoursesQuery } from "@/features/api/courseApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users, Star, Clock, Eye } from "lucide-react";

const SearchPageSimple = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Extract parameters from URL
    const query = searchParams.get("query") || "";
    const [searchInput, setSearchInput] = useState(query);
    
    const { data, isLoading, error } = useSearchCoursesQuery({
        searchQuery: query,
        categories: [],
        sortByPrice: ""
    });
    
    const courses = data?.courses || [];
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/course/search?query=${encodeURIComponent(searchInput.trim())}`);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Search Courses
                    </h1>
                    
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-2xl">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search for courses..."
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </div>
                    </form>
                    
                    {query && (
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            Search results for: <strong>"{query}"</strong>
                        </p>
                    )}
                </div>
                
                {/* Results */}
                <div>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <p>Loading courses...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                <strong>Error loading courses!</strong>
                                <p>Please check if the server is running</p>
                            </div>
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course) => (
                                <Card key={course._id} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                                    <div className="relative overflow-hidden">
                                        <Link to={`/course-detail/${course._id}`}>
                                            <img
                                                src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                                alt={course.courseTitle}
                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </Link>

                                        {/* Price Badge */}
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-white/90 text-gray-900 font-bold">
                                                {course.coursePrice ? `₹${course.coursePrice}` : 'Free'}
                                            </Badge>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge variant="secondary" className="bg-primary/90 text-white">
                                                {course.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            {/* Course Title */}
                                            <Link to={`/course-detail/${course._id}`}>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                                    {course.courseTitle}
                                                </h3>
                                            </Link>

                                            {/* Course Subtitle */}
                                            {course.subTitle && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                                    {course.subTitle}
                                                </p>
                                            )}

                                            {/* Course Stats */}
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <BookOpen size={12} />
                                                    <span>{course.lectures?.length || 0} lectures</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    <span>{course.enrolledStudents?.length || 0} students</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    <span>2h 30m</span>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={12}
                                                            className="text-yellow-400 fill-current"
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">4.8</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">(234)</span>
                                            </div>

                                            {/* Instructor */}
                                            {course.creator && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    By {course.creator.name}
                                                </p>
                                            )}

                                            {/* Action Button */}
                                            <div className="pt-2">
                                                <Link to={`/course-detail/${course._id}`} className="w-full">
                                                    <Button className="w-full btn-primary">
                                                        <Eye size={16} className="mr-2" />
                                                        View Course Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                                <strong>No courses found</strong>
                                <p>Try searching with different keywords</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPageSimple;
