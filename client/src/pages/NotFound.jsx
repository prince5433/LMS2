import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-gray-300 dark:text-gray-600 mb-4">
              404
            </div>
            <div className="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track with your learning journey.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              
              <Link to="/course/search" className="block">
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/my-learning">
                <Button variant="ghost" size="sm">
                  My Learning
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
