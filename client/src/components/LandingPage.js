import React from 'react';
import { AppBar, Box, Button, Container, Grid, IconButton, Toolbar, Typography, Card, CardContent } from '@mui/material';
import { ArrowForward, Menu as MenuIcon, CheckCircle, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Custom font styling
const sfProFont = {
  fontFamily: `"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
};

// Theme colors
const primaryColor = "#8ab4f8";
const backgroundColor = "#202124";
const textColor = "#e8eaed";
const activeTextColor = "#ffffff";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <Box sx={{ 
      backgroundColor, 
      height: '100vh', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      color: textColor 
    }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#333333', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, ...sfProFont }}>
            USC
          </Typography>
          <IconButton color="inherit" onClick={handleLogin} aria-label="login">
            <LoginIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content wrapper */}
      <Container maxWidth="lg" sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        py: 4 
      }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3"
            gutterBottom 
            sx={{ fontWeight: 700, color: activeTextColor, ...sfProFont }}
          >
            Ultimate Supply Chain ERP 
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ mb: 2, fontSize: '0.9rem', ...sfProFont }}
          >
            USC IS a comprehensive Integrated Management System for wholesale, distribution, and retail sectors.
          </Typography>
          <br/>
          <Button 
            variant="contained" 
            size="large" 
            endIcon={<ArrowForward />} 
            sx={{ backgroundColor: primaryColor, color: activeTextColor, ...sfProFont, mr: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            sx={{ borderColor: primaryColor, color: primaryColor, ...sfProFont, mr: 2 }}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            sx={{ borderColor: primaryColor, color: primaryColor, ...sfProFont }}
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </Button>
        </Box>

        {/* Key Features Section */}
        <Box>
          <Grid container spacing={2}>
            {[
              'Multi-Branch Management',
              'MPESA Integration',
              'Store Management',
              'POS Integration',
              'Financial Reporting',
              'Sales Rep Management',
              'Profitability Analysis',
              'Field Sales Management'
            ].map((feature) => (
              <Grid item xs={6} sm={4} md={3} key={feature}>
                <Card 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: 2, 
                    textAlign: 'center', 
                    color: textColor,
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <CheckCircle sx={{ fontSize: 24, color: primaryColor, mb: 0.5 }} />
                    <Typography variant="subtitle2" sx={{ ...sfProFont, fontSize: '0.8rem' }}>{feature}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ fontWeight: 600, color: activeTextColor, ...sfProFont }}
          >
            Ready to Take Your Business to the Next Level?
          </Typography>
          <Button 
            variant="outlined"
            size="large" 
            sx={{
              color: primaryColor,
              borderColor: primaryColor,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(138, 180, 248, 0.1)',
              },
              ...sfProFont
            }}
            onClick={() => window.open('https://wa.me/254759643825', '_blank')}
          >
            Contact Us
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 2, textAlign: 'center', backgroundColor: '#1c1c1e' }}>
        <Typography variant="body2" sx={{ ...sfProFont }}>
          © 2024 USC. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
