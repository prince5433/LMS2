import React, { useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSearchCoursesQuery } from "@/features/api/courseApi";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Search,
  Filter as FilterIcon,
  Grid,
  List,
  SortAsc,
  SortDesc,
  BookOpen,
  Users,
  Star,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extract parameters from URL
    const query = searchParams.get("query") || "";
    const [searchInput, setSearchInput] = useState(query);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showFilters, setShowFilters] = useState(false);

    const { data, isLoading, error } = useSearchCoursesQuery({
        searchQuery: query,
        categories: selectedCategories,
        sortByPrice
    });

    const courses = data?.courses || [];
    const isEmpty = !isLoading && courses.length === 0;

    const handleFilterChange = (categories, price) => {
        setSelectedCategories(categories);
        setSortByPrice(price);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ query: searchInput.trim() });
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSortByPrice("");
    };

    const sortOptions = [
        { label: "Relevance", value: "" },
        { label: "Price: Low to High", value: "low" },
        { label: "Price: High to Low", value: "high" },
        { label: "Newest First", value: "newest" },
        { label: "Most Popular", value: "popular" }
    ];

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Search Error
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Failed to search courses. Please try again.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                {/* Search Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {query ? `Search Results for "${query}"` : "Browse All Courses"}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {isLoading ? "Searching..." : `${courses.length} courses found`}
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full lg:w-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" className="btn-primary">
                                Search
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <FilterIcon size={16} />
                                Filters
                                {(selectedCategories.length > 0 || sortByPrice) && (
                                    <Badge variant="secondary" className="ml-2">
                                        {selectedCategories.length + (sortByPrice ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>

                            {(selectedCategories.length > 0 || sortByPrice) && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <SortAsc size={16} className="mr-2" />
                                        Sort by
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {sortOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => setSortByPrice(option.value)}
                                        >
                                            {option.label}
                                            {sortByPrice === option.value && " ✓"}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* View Mode Toggle */}
                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className="rounded-r-none"
                                >
                                    <Grid size={16} />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className="rounded-l-none"
                                >
                                    <List size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <Filter handleFilterChange={handleFilterChange} />
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <CourseSkeleton key={idx} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : isEmpty ? (
                            <CourseNotFound query={query} />
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                                {courses.map((course) => (
                                    <SearchResult
                                        key={course._id}
                                        course={course}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

const CourseNotFound = ({ query }) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {query ? `No courses found for "${query}"` : "No courses available"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        {query
                            ? "Try adjusting your search terms or browse our course categories below."
                            : "Check back later for new courses or explore our featured content."
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/course/search?query=">
                            <Button variant="outline">
                                Browse All Courses
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button className="btn-primary">
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    {/* Suggested Categories */}
                    <div className="mt-8 w-full max-w-md">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Popular Categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Web Development", "Data Science", "UI/UX Design", "Mobile Development"].map((category) => (
                                <Link
                                    key={category}
                                    to={`/course/search?query=${category}`}
                                >
                                    <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                                        {category}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const CourseSkeleton = ({ viewMode = "grid" }) => {
    if (viewMode === "list") {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <Skeleton className="h-20 w-32 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                        <div className="text-right">
                            <Skeleton className="h-6 w-16 mb-2" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};