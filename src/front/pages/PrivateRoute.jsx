import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};