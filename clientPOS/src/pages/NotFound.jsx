import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '50px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ fontSize: '3rem', color: '#333' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>The page you are looking for does not exist.</p>
      <Link to="/" style={{
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
      }}>
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
