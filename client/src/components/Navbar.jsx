import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 glass border-b border-border/50 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <School size={28} className="text-indigo-500" />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl gradient-text">
              E-Learning
            </h1>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 transition-all duration-300">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border border-border/50 shadow-xl">
                <DropdownMenuLabel className="font-semibold">{user?.name || "My Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {user?.role === "student" ? (
                    <>
                      <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500/10 transition-colors">
                        <Link to="my-learning">My Learning</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500/10 transition-colors">
                        <Link to="/">Browse Courses</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500/10 transition-colors">
                        <Link to="/admin/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500/10 transition-colors">
                        <Link to="/admin/course">My Courses</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500/10 transition-colors">
                        <Link to="/admin/course/create">Create Course</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-500/10 transition-colors">
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer text-red-500 hover:bg-red-500/10 transition-colors">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/login")} className="rounded-full border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all duration-300">
                Login
              </Button>
              <Button onClick={() => navigate("/login")} className="rounded-full gradient-btn text-white border-0">
                Signup
              </Button>
            </div>
          )}
          <DarkMode />

          {/* Mobile Nav */}
          <div className="md:hidden">
            <MobileNavbar user={user} logoutHandler={logoutHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col glass">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <span className="gradient-text font-bold text-xl">E-Learning</span>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="my-2" />
        <nav className="flex flex-col space-y-4 mt-4">
          {user?.role === "student" ? (
            <>
              <Link to="/my-learning">My Learning</Link>
              <Link to="/">Browse Courses</Link>
            </>
          ) : (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/course">My Courses</Link>
              <Link to="/admin/course/create">Create Course</Link>
            </>
          )}
          <Link to="/profile">Edit Profile</Link>
        </nav>
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            {user ? (
              <Button onClick={logoutHandler} variant="destructive" className="rounded-full w-full">
                Log out
              </Button>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Button variant="outline" onClick={() => navigate("/login")} className="rounded-full">
                  Login
                </Button>
                <Button onClick={() => navigate("/login")} className="rounded-full gradient-btn text-white border-0">
                  Signup
                </Button>
              </div>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
