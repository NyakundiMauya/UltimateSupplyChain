// MainLayout.jsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar'; // Ensure this path is correct
import 'react-toastify/dist/ReactToastify.css';

function MainLayout({ children }) {
  return (
    <div>
      <Navbar /> {/* Include Navbar here */}
      <main>
        <div className="container mt-3">
          {children}
        </div>
        <ToastContainer />
      </main>
    </div>
  );
}

export default MainLayout;

