// components/PublicRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user is logged in, yeet them to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
