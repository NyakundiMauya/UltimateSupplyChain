// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';  // Import the Home component
import Auth from './Auth';  // Import the Auth component
import Dashboard from './components/Dashboard'; // Update the import path
import { FaHome, FaUser, FaCog, FaBars, FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';


const IconButton = ({ Icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 transition duration-300"
  >
    <Icon className="text-3xl" />
    <span className="text-xs mt-1">{label}</span>
  </motion.div>
);


const Sidebar = ({ isOpen, toggleSidebar }) => (
  <motion.div
    initial={{ x: '-100%' }}
    animate={{ x: isOpen ? '0%' : '-100%' }}
    transition={{ duration: 0.3 }}
    className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform ease-in-out"
  >
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 transition duration-300"
        >
          <FaBars className="text-3xl" />
        </motion.button>
      </div>
      <div className="flex flex-col items-center space-y-6 mt-8">
        <IconButton Icon={FaHome} label="Home" />
        <IconButton Icon={FaUser} label="Profile" />
        <IconButton Icon={FaCog} label="Settings" />
      </div>
    </div>
  </motion.div>
);

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token')); // Manage token state

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Save token to local storage
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove token from local storage
  };

  return (
    <Router>
      <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-blue-50'} ${darkMode ? 'dark' : ''}`}>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex justify-center items-center flex-grow p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center w-full max-w-lg" // Center the Home component
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth onLogin={handleLogin} />} /> {/* Pass handleLogin */}
              <Route 
                path="/dashboard" 
                element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/auth" />} // Protecting the dashboard route
              />
            </Routes>
          </motion.div>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
