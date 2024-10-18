import React, { useEffect, useState, useMemo } from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { createCustomTheme } from "./theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import EmployeeManagement from "scenes/Employee/EmployeeManagement";
import LandingPage from "components/LandingPage";
import LoginPage from "components/Auth/LoginPage";
import Settings from "scenes/settings";
import Inventory from "scenes/Inventory";
import Signup from "components/Auth/SignUpPage";
import Assets from "scenes/assets"; // Updated import (lowercase 'assets')
import Expenses from "scenes/Expenses"; // Simplified import
import Invoices from "scenes/Invoices"; // Simplified import
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
  const mode = useSelector((state) => state.global?.mode ?? "light");
  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={
              
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/daily" element={<Daily />} />
                    <Route path="/monthly" element={<Monthly />} />
                    <Route path="/breakdown" element={<Breakdown />} />
                    <Route path="/employees" element={<EmployeeManagement />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/invoices" element={<Invoices />} />

                  </Route>
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
