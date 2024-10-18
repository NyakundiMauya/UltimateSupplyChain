import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/SecLayout';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import jsPDF from 'jspdf';
import { getAuthDataFromCache, isAuthenticated } from '../utils/authUtils'; // Adjust the import path as needed

// Add this function at the top of your file, outside of the component
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: [] };
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expirationDate: '',
  });
  const [cvv, setCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const calculatedTotal = cart.reduce((total, item) => total + item.totalAmount, 0);
    setTotalAmount(calculatedTotal);
  }, [cart]);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthChecking(true);
      const isAuth = await isAuthenticated();
      if (isAuth) {
        const data = await getAuthDataFromCache();
        setAuthData(data);
        setUser(data.customer); // Assuming the customer data is nested under 'customer'
      } else {
        navigate('/signin', { state: { from: location.pathname } });
      }
      setIsAuthChecking(false);
    };

    checkAuth();
  }, [navigate, location]);

  if (isAuthChecking) {
    return <CircularProgress />; // Or any loading indicator
  }

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a 2-second payment process
    setTimeout(async () => {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          },
          body: JSON.stringify({
            userId: user.id,
            amount: totalAmount,
            products: cart.map(item => ({
              product: item._id,
              quantity: item.quantity,
              price: item.price
            })),
            paymentMethod,
            ...(paymentMethod === 'mpesa' ? { phoneNumber } : {}),
            branchCode: 'NBO001', 
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to process transaction');
        }

        navigate('/payment-confirmation', { 
          state: { 
            transactionId: result.transaction._id,
            orderId: result.transaction.orderId,
            amount: result.transaction.amount,
            paymentMethod: result.transaction.paymentMethod,
            branchCode: result.transaction.branchCode 
          } 
        });
      } catch (error) {
        console.error('Error processing transaction:', error);
        setError(error.message || 'Failed to process transaction. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 2000); // 2-second delay
  };

  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Function to generate PDF receipt
  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    
    // Receipt Header
    doc.setFontSize(20);
    doc.text("Store Name", 14, 22);
    doc.setFontSize(12);
    doc.text("Store Address", 14, 32);
    doc.text("Phone: (123) 456-7890", 14, 42);
    doc.text("Email: store@example.com", 14, 52);
    
    // Timestamp
    const timestamp = new Date().toLocaleString();
    doc.text(`Date: ${timestamp}`, 14, 62);
    
    // Receipt Title
    doc.setFontSize(16);
    doc.text("Receipt", 14, 82);
    doc.setFontSize(12);
    doc.text(`Payment Method: ${paymentMethod}`, 14, 92);
    doc.text(`Total Amount: KSH ${totalAmount.toFixed(2)}`, 14, 102);

    // Adding Cart Details
    doc.text("Cart Summary:", 14, 112);
    cart.forEach((item, index) => {
      doc.text(`${item.name} (x${item.quantity}): KSH ${item.totalAmount.toFixed(2)}`, 14, 122 + (index * 10));
    });

    doc.text(`----------------------------------`, 14, 122 + (cart.length * 10 + 10));
    
    // Total Amount
    doc.setFontSize(14);
    doc.text(`Total Amount: KSH ${totalAmount.toFixed(2)}`, 14, 132 + (cart.length * 10 + 10));
    
    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 14, 142 + (cart.length * 10 + 10));
    doc.save('receipt.pdf');
  };

  return (
    <MainLayout>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh', // Changed from height to minHeight
          padding: 2,
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Card 
          sx={{ 
            width: '100%', 
            maxWidth: 400, 
            boxShadow: 3, 
            borderRadius: 2, 
            padding: 2,
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cart Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {cart && cart.length > 0 ? (
                cart.map((item) => (
                  <Grid item xs={12} key={item._id}>
                    <Box sx={{ py: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        {item.name} (x{item.quantity})
                      </Typography>
                      <Typography variant="body1">
                        KSH {item.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Your cart is empty.
                </Typography>
              )}
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Total: KSH {totalAmount.toFixed(2)}
            </Typography>

            {/* Payment Method Selection */}
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup 
                row 
                aria-label="payment method" 
                name="paymentMethod" 
                value={paymentMethod} 
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
                <FormControlLabel value="mpesa" control={<Radio />} label="MPesa" />
              </RadioGroup>
            </FormControl>

            {/* Payment Form for Card Payment */}
            {paymentMethod === 'card' && (
              <Box component="form" sx={{ mt: 2 }} onSubmit={handleProceedToPayment}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">Payment Successful!</Alert>}

                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  variant="outlined"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Name"
                  name="cardName"
                  value={paymentDetails.cardName}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  variant="outlined"
                  size="small"
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Exp. Date"
                      name="expirationDate"
                      value={paymentDetails.expirationDate}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={cvv}
                      onChange={handleCvvChange}
                      sx={{ mb: 2 }}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* MPesa Payment Instructions */}
            {paymentMethod === 'mpesa' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  sx={{ mb: 2 }}
                  required
                  variant="outlined"
                  size="small"
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This transaction will prompt you to input your PIN on your MPesa.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Please follow the MPesa payment instructions on your phone.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate('/pos')}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  padding: '6px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  },
                }}
              >
                Previous
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleProceedToPayment}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Pay Now'}
              </Button>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleDownloadReceipt}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                padding: '6px 16px',
                mt: 2,
                '&:hover': {
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                },
              }}
            >
              Receipt
            </Button>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default Checkout;
