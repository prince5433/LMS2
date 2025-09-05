import React, { useEffect, useState } from 'react'
import { GraduationCap, Search, Bell, BookOpen, User, LogOut, Settings, Menu, BarChart3 } from 'lucide-react'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import DarkMode from '../DarkMode';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useLogoutUserMutation } from "@/features/api/authApi";
import { Link, useNavigate } from "react-router-dom"

import { toast } from "sonner";

import { useSelector } from "react-redux";



const Navbar = () => {
  // const user = true;//this is just a dummy variable to check if the user is logged in or not
  // This is a functional component that renders a navigation bar with a logo and title.

  const { user } = useSelector((store) => store.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);



  const [logOutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  // Quick search suggestions
  const quickSearches = [
    'React Development',
    'JavaScript',
    'Python',
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Node.js',
    'Machine Learning'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const filtered = quickSearches.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(filtered);
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
    navigate(`/course/search?query=${encodeURIComponent(suggestion)}`);
  };

  const logoutHandler = async () => {
    await logOutUser();
  }
  // console.log(user);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logout Successfull")
      navigate("/login")
    }
  }
    , [isSuccess])

  return (
    <div className="h-16 glass-effect border-b border-border/50 fixed top-0 left-0 right-0 duration-300 z-50 backdrop-blur-md">
      {/*Desktop*/}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center h-full px-6">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <div>
            <h1 className='font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
              EduMaster
            </h1>
            <p className="text-xs text-muted-foreground">Learn & Grow</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/course/search?query=" className="text-sm font-medium hover:text-primary transition-colors">
            Courses
          </Link>
          {user && (
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
          {/* Only show My Learning for students */}
          {user && user.role === "student" && (
            <Link to="/my-learning" className="text-sm font-medium hover:text-primary transition-colors">
              My Learning
            </Link>
          )}
        </nav>

        {/* Search Bar with Suggestions */}
        <div className="hidden lg:flex items-center max-w-md flex-1 mx-8 relative">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery && setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              placeholder="Search courses..."
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </form>

          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div className="p-1">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2 text-sm"
                  >
                    <Search size={14} className="text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* DEBUG */}
          <div className="text-xs bg-yellow-200 p-1 rounded">
            {user ? `User: ${user.name}` : 'No User'}
          </div>

          {true ? (
            <>
              {/* Notifications - Removed static notification for now */}
              {/* Future: Add dynamic notifications here */}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" className="relative h-10 w-10 rounded-full bg-red-800">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoUrl} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuContent
                    className="z-[9999] min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md bg-white text-black dark:bg-gray-900 dark:text-gray-100 border-border/50"
                    align="end"
                    sideOffset={6}
                  >
                    <div className="px-2 py-1.5 text-sm font-semibold">
                      <p>{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>

                    <DropdownMenuSeparator className="h-px bg-border my-1" />

                    <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                      <User size={16} className="mr-2" />
                      <Link to="/profile" className="flex-1">Profile</Link>
                    </DropdownMenuItem>

                    {/* Student-specific options - Only show for students */}
                    {user && user.role === "student" && (
                      <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                        <BookOpen size={16} className="mr-2" />
                        <Link to="/my-learning" className="flex-1">My Learning</Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                      <Settings size={16} className="mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>

                    {user?.role === "instructor" && (
                      <>
                        <DropdownMenuSeparator className="h-px bg-border my-1" />
                        <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                          <GraduationCap size={16} className="mr-2" />
                          <Link to="/admin/dashboard" className="flex-1">Instructor Dashboard</Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="h-px bg-border my-1" />
                    <DropdownMenuItem
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground text-red-600"
                      onClick={logoutHandler}
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/login")} className="bg-blue-100">
                Log in
              </Button>
              <Button onClick={() => navigate("/login")} className="btn-primary">
                Sign up
              </Button>
            </div>
          )}

          {/* EMERGENCY BACKUP BUTTONS - ALWAYS VISIBLE */}
          <div className="flex items-center gap-2 ml-2">
            <Button variant="outline" onClick={() => navigate("/login")} className="bg-red-100 text-xs">
              🚨 Login
            </Button>
            <Button onClick={() => navigate("/login")} className="bg-red-500 text-white text-xs">
              🚨 Signup
            </Button>
          </div>

          <DarkMode />
        </div>
      </div>

      {/*Mobile*/}
      <div className='flex md:hidden justify-between items-center h-full px-4'>
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <GraduationCap size={20} className="text-primary" />
          </div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            EduMaster
          </h1>
        </Link>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  )
}

export default Navbar;


const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-lg"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 p-0">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <GraduationCap size={20} className="text-primary" />
              </div>
              <SheetTitle className="text-lg font-bold">EduMaster</SheetTitle>
            </div>
            <DarkMode />
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-6 space-y-2">
            <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <BookOpen size={18} />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/course/search?query=" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <Search size={18} />
              <span className="font-medium">Browse Courses</span>
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <BarChart3 size={18} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                {/* Student-specific navigation - Only show for students */}
                {user && user.role === "student" && (
                  <Link to="/my-learning" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <BookOpen size={18} />
                    <span className="font-medium">My Learning</span>
                  </Link>
                )}

                <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <User size={18} />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={() => {}}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors w-full text-left"
                >
                  <Settings size={18} />
                  <span className="font-medium">Settings</span>
                </button>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border/50 space-y-3">
            {user ? (
              <>
                {user?.role === "instructor" && (
                  <SheetClose asChild>
                    <Button
                      onClick={() => navigate("/admin/dashboard")}
                      className="w-full btn-primary"
                    >
                      <GraduationCap size={16} className="mr-2" />
                      Instructor Dashboard
                    </Button>
                  </SheetClose>
                )}
                <Button
                  variant="outline"
                  onClick={logoutHandler}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full btn-primary"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};