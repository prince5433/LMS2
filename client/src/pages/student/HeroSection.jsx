import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 py-28 md:py-36 px-4 text-center animate-gradient">
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-300/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "0.8s" }} />

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
          Find the Best Courses
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300">
            for You
          </span>
        </h1>
        <p className="text-indigo-100 dark:text-gray-400 mb-10 text-lg md:text-xl animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Discover, Learn, and Upskill with our wide range of courses
        </p>

        <form
          onSubmit={searchHandler}
          className="flex items-center bg-white/95 dark:bg-gray-800/90 rounded-full shadow-2xl shadow-indigo-900/20 overflow-hidden max-w-xl mx-auto mb-8 ring-1 ring-white/20 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="flex-grow border-none focus-visible:ring-0 px-6 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent text-base"
          />
          <Button
            type="submit"
            className="gradient-btn text-white px-8 py-4 rounded-full m-1 border-0 font-semibold"
          >
            Search
          </Button>
        </form>
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/25 hover:bg-white/25 px-8 py-3 font-medium transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "0.45s" }}
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
