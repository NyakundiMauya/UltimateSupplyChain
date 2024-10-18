// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import HomePage from './pages/HomePage';
import POSPage from './pages/POSPage';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import SignIn from './components/Auth/Login';
import SignUp from './components/Auth/Signup';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import PaymentConfirmation from './pages/PaymentConfirmation';
import { getAuthDataFromCache } from './utils/authUtils';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authData = await getAuthDataFromCache();
      setIsLoggedIn(!!authData);
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/pos" element={<ProtectedRoute><POSPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment-confirmation" element={<ProtectedRoute><PaymentConfirmation /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
