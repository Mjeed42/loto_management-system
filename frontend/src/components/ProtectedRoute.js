import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // If no token, redirect to login immediately
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/");
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(
          "https://loto-backend-643788243736.europe-west1.run.app//api/auth/me",
          config
        );
        setIsAuthenticated(true);
        setUserRole(res.data.user.role);
      } catch (err) {
        console.log("Auth check failed, redirecting to login:", err.message);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  // While checking authentication, show loading
  if (isAuthenticated === null) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Checking authentication...</p>
      </div>
    );
  }

  // If not authenticated, don't render children, just redirect
  if (!isAuthenticated) {
    return null; // Navigation already handled in useEffect
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case "admin":
        navigate("/admin");
        return null;

      default:
        navigate("/dashboard");
        return null;
    }
  }

  // If authenticated and authorized, render children
  return children;
};

export default ProtectedRoute;
