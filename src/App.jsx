import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./pages/Auth/Protect";

const App = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  );
};

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");  // Remove expired token
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);  // Valid token
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    } else {
      setIsAuthenticated(false);  // No token
    }

    setIsLoading(false);  // Finished checking
  }, []);

  if (isLoading) return <div>Loading...</div>;  // Loading state

  // Redirect based on authentication
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Navigate to="/dashboard" />;
};

export default App;
