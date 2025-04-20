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
          
          {user.role !== 'instructor' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">Dashboard Not Visible?</h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-2">
                You need to have the "instructor" role to see the Dashboard option.
                Your current role is set to "{user.role}".
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                To update your role, you'll need to modify it in the database or ask an administrator to update it for you.
              </p>
            </div>
          )}
          
          {user.role === 'instructor' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">Dashboard Access Available</h3>
              <p className="text-green-700 dark:text-green-300 mb-2">
                You have the "instructor" role, so you should be able to see the Dashboard option in the dropdown menu.
              </p>
              <p className="text-green-700 dark:text-green-300">
                If you still can't see it, try refreshing the page or check if there are any other issues.
              </p>
              <div className="mt-4">
                <Link to="/admin/dashboard">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
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
