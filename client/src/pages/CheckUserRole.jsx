import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CheckUserRole = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="max-w-4xl mx-auto px-4 my-10 pt-16">
      <h1 className="font-bold text-2xl text-center md:text-left mb-6">User Role Checker</h1>
      
      {user ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current User Information</h2>
          
          <div className="mb-4">
            <p className="font-medium">Name: <span className="font-normal">{user.name}</span></p>
            <p className="font-medium">Email: <span className="font-normal">{user.email}</span></p>
            <p className="font-medium">Role: <span className={`font-normal ${user.role === 'instructor' ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.role}
            </span></p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              {user.role === 'instructor' ? 'Instructor Dashboard' : 'Student Dashboard'}
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-2">
              {user.role === 'instructor'
                ? 'As an instructor, you can create courses, manage students, and track your revenue.'
                : 'As a student, you can browse courses, track your progress, and manage your learning.'
              }
            </p>
            <div className="mt-4 flex gap-3">
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Go to Dashboard
                </Button>
              </Link>
              {user.role === 'instructor' && (
                <Link to="/admin/course">
                  <Button variant="outline">
                    Manage Courses
                  </Button>
                </Link>
              )}
              {user.role === 'student' && (
                <Link to="/my-learning">
                  <Button variant="outline">
                    My Learning
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200">Not Logged In</h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            You need to be logged in to check your user role and access the dashboard.
          </p>
          <Link to="/login">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Go to Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CheckUserRole;
