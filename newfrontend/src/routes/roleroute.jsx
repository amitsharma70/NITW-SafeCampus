import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { axiosInstance } from '../auth/axiosInstance'; // adjust path if needed

const RoleRoute = ({ requiredRole, children }) => {
  const [hasAccess, setHasAccess] = useState(null); // true | false | null (loading)
  const [error, setError] = useState(false);
  const [user, setuser]=useState('')
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get('/api/users/userinfo');

        const userData = response.data;
        setuser(userData);
        // Check if the requiredRole is a truthy value (like 1) in the user data
        if (userData && userData[requiredRole]) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError(true);
      }
    };

    fetchUserRole();
  }, [requiredRole]);

  let nav='/';
            if(user.downloader){ console.log('hello');
             nav='/vlcc-po';}
            if(user.uploader) nav='/upload'
            if(user.approver) nav='/vlcc-po'
            
  if (error) {
    return <Navigate to={nav} replace />;
  }

  if (hasAccess === null) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!hasAccess) {
    return <Navigate to={nav} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
