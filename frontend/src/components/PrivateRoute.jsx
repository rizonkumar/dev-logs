import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const PrivateRoute = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return isSignedIn ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
