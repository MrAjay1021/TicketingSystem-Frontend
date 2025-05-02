import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can add a loading spinner component here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if requiredRole is provided
  if (requiredRole && currentUser?.role !== requiredRole) {
    // Optional: Redirect to a specific unauthorized page or back to dashboard
    // Redirecting to dashboard for now
    console.warn(`ProtectedRoute: User does not have required role '${requiredRole}' for ${location.pathname}`);
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and role matches (or no role required), render children
  return children;
};

export default ProtectedRoute; 