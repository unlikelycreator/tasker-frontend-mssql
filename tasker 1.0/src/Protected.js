import React from "react";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const loggedIn = sessionStorage.getItem("loggedIn");
  

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default Protected;
