import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("dashboard");
  const isCourse = location.pathname.includes("course");

  return (
    <div className="flex mt-16">
      <div className="hidden lg:block w-[250px] sm:w-[280px] space-y-2 border-r border-border/50 p-5 sticky top-16 h-[calc(100vh-4rem)] bg-card/50">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-4">Admin Panel</p>
        <div className="space-y-1">
          <Link
            to="dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isDashboard
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
          >
            <ChartNoAxesColumn size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="course"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isCourse
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
          >
            <SquareLibrary size={20} />
            <span>Courses</span>
          </Link>
        </div>
      </div>
      <div className="flex-1 p-6 md:p-10 bg-background min-h-[calc(100vh-4rem)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
