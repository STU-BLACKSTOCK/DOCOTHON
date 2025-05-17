
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Access denied: User not authenticated");
    }
  }, [loading, isAuthenticated]);

  // Check if authentication is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  if (isAuthenticated) {
    // If the user is authenticated but tries to access a role-specific route they don't have access to
    if (
      (location.pathname.startsWith("/doctor") && user?.role !== "doctor") ||
      (location.pathname.startsWith("/staff/upload") && user?.role !== "staff")
    ) {
      return <Navigate to={user?.role === "doctor" ? "/doctor/dashboard" : "/staff/dashboard"} replace />;
    }
    
    // User is authenticated and has the right role, allow access
    return <Outlet />;
  }

  // Not authenticated, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
