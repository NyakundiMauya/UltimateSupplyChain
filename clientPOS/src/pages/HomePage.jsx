import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  useTheme,
} from '@mui/material';
import Navbar from '../components/Navbar'; // Maintained Navbar import

const steps = [
  {
    title: 'Select Items',
    description: 'Add items to your cart',
    icon: require('../assets/images/Select.jpg'),
  },
  {
    title: 'Review Cart',
    description: 'Check your items and make any necessary changes',
    icon: require('../assets/images/Cart.jpg'),
  },
  {
    title: 'Pay & Go',
    description: 'Complete your purchase with various payment options',
    icon: require('../assets/images/Payment.jpg'),
  },
];

const benefits = [
  'No waiting in long lines',
  'Control over scanning and bagging',
  'Contactless shopping experience',
  'Quick and efficient checkout process',
];

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('token'); // Change this based on your auth logic

  const handleStartShopping = () => {
    navigate(isAuthenticated ? '/pos' : '/signin');
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 8 }}> {/* Add top padding */}
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 400,
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Fast, Easy, and Convenient Shopping
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Experience the future of retail with our self-checkout system
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              borderRadius: '8px',
              padding: '8px 24px',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': { bgcolor: theme.palette.primary.dark },
            }}
            onClick={handleStartShopping}
          >
            Start Shopping
          </Button>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ my: 6, borderBottom: `1px solid ${theme.palette.divider}`, pb: 6 }}>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 4, color: theme.palette.text.primary }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                  <Box
                    component="img"
                    src={step.icon}
                    alt={step.title}
                    sx={{
                      width: '100%',
                      maxWidth: 250,
                      height: 'auto',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="#565959">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 4, color: theme.palette.text.primary }}>
           Benefits of this POS
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  height: '100%',
                }}>
                  <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                    • {benefit}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
