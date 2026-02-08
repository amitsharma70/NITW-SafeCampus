import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
