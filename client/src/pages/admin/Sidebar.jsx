import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex pt-16"> {/* Added pt-16 to account for navbar height */}
      <div className="w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5 sticky top-16 h-[calc(100vh-64px)]">
        <div className="space-y-4 mt-4">
          <Link to="dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            <ChartNoAxesColumn size={22} />
            <h1 className="font-medium">Dashboard</h1>
          </Link>
          <Link to="course" className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
            <SquareLibrary size={22} />
            <h1 className="font-medium">Courses</h1>
          </Link>
        </div>
      </div>
      <div className="flex-1 p-6">
        <Outlet/>
      </div>
    </div>
  );
};

export default Sidebar;