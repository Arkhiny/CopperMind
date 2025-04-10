// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Retrieve the active user from localStorage (stored as a JSON string)
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  
  if (!activeUser) {
    // If there is no active user, redirect to Login
    return <Navigate to="/Login" replace />;
  }
  
  // Otherwise, render children (the protected page)
  return children;
}

export default ProtectedRoute;