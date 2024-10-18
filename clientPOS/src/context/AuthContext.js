// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to hold user information

    const login = (userData) => {
        setUser(userData); // Set user data
    };

    const logout = () => {
        setUser(null); // Clear user data
        localStorage.removeItem('token'); // Remove token from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); // Custom hook to use auth context

