// pages/Auth/Protect.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const Protected = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // If token is missing, redirect to login
  if (!token) {
    console.log("No token found. Redirecting to login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  try {
    // Check if token is a valid JWT (should have 3 parts)
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode token payload and check expiration
    const payload = JSON.parse(atob(tokenParts[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      console.log("Token expired. Redirecting to login...");
      localStorage.removeItem("token");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Token is valid
    return children;
  } catch (error) {
    console.log("Token invalid or error in parsing. Redirecting to login...", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default Protected;
