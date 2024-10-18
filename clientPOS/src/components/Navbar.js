import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('token');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <AppBar position="fixed" sx={{ 
      backgroundColor: '#333333', // Dark grey background
      boxShadow: 2,
    }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', padding: '10px 0' }}>
          <Typography variant="h6" component="div">
            <NavLink to="/" style={{ 
              textDecoration: 'none', 
              color: '#ffffff', 
              fontWeight: 700,
              fontSize: '1.5rem',
            }}>
              POS
            </NavLink>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <Button 
                  component={NavLink} 
                  to="/pos" 
                  sx={{
                    color: '#ffffff',
                    marginRight: '20px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { backgroundColor: '#4a4a4a' } // Lighter grey on hover
                  }}
                >
                  POS
                </Button>
                <Button 
                  onClick={handleLogout}
                  sx={{
                    color: '#ffffff',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { backgroundColor: '#4a4a4a' } // Lighter grey on hover
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={NavLink} 
                  to="/signin"
                  sx={{
                    color: '#ffffff',
                    marginRight: '20px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { backgroundColor: '#4a4a4a' } // Lighter grey on hover
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  component={NavLink} 
                  to="/signup"
                  variant="contained"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#333333', // Dark grey text
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { 
                      backgroundColor: '#e0e0e0', // Light grey on hover
                      color: '#333333' // Dark grey text on hover
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
