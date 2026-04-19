import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true); // Start loading

            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                // You might want to add token validation here by sending a request to the backend
                // to ensure the token is still valid. For simplicity, we'll just assume it's valid for now.
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false); // Ensure explicitly set to false if no token
            }
            setLoading(false); // End loading
        };

        checkAuthStatus();
    }, []); // Run this effect only once on component mount


    const login = (token, user) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const contextValue = {
        isAuthenticated,
        user,
        token,
        login,
        logout,
        loading, // Expose loading state
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading ? children : <div>Loading App...</div>} {/* Conditionally render children when not loading */}
        </AuthContext.Provider>
    );
};