import React, { useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [selectedCategories, setSelectedCatgories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice
  });

  const isEmpty = !isLoading && data?.courses.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCatgories(categories);
    setSortByPrice(price);
  }
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 mt-20">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-extrabold text-2xl md:text-3xl mb-2">
          Results for "<span className="gradient-text">{query}</span>"
        </h1>
        <p className="text-muted-foreground">
          Showing results for{" "}
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold italic">{query}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange} />
        <div className="flex-1 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses?.map((course) => <SearchResult key={course._id} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="text-red-500 h-10 w-10" />
      </div>
      <h1 className="font-bold text-2xl mb-2">
        Course Not Found
      </h1>
      <p className="text-muted-foreground mb-6 text-center">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/">
        <Button className="gradient-btn text-white rounded-full border-0 px-6">
          Browse All Courses
        </Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-card border border-border/50 rounded-xl p-4">
      <Skeleton className="h-32 w-full md:w-56 rounded-lg" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-6 w-20 mt-2 rounded-full" />
      </div>
      <div className="flex items-start">
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </div>
  );
};
