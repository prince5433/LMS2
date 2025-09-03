import React from 'react';
import { useSelector } from 'react-redux';
import StudentDashboard from './student/StudentDashboard';
import InstructorDashboard from './instructor/InstructorDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show appropriate dashboard based on user role
  if (user?.role === 'instructor') {
    return <InstructorDashboard />;
  } else if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  // Default fallback (shouldn't happen if role is properly set)
  return <StudentDashboard />;
};

export default Dashboard;
