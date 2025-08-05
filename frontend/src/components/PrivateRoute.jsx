import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return userInfo ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
