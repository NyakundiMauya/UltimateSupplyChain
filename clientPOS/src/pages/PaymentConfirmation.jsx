import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/SecLayout';
import { Box, Typography, Paper, Button, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import jsPDF from 'jspdf';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionId, orderId, amount, paymentMethod } = location.state || {};
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Show the success icon immediately when the component mounts
    setShowSuccess(true);
  }, []);

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    
    // Set font size and type
    doc.setFontSize(12);
    
    // Add content to the PDF
    doc.text('Payment Receipt', 105, 15, { align: 'center' });
    doc.text(`Transaction ID: ${transactionId}`, 20, 30);
    doc.text(`Order ID: ${orderId}`, 20, 40);
    doc.text(`Amount: KSH ${amount?.toFixed(2)}`, 20, 50);
    doc.text(`Payment Method: ${paymentMethod}`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 70);
    
    // Save the PDF
    doc.save('payment_receipt.pdf');
  };

  const handleGoToPOS = () => {
    navigate('/pos');
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400 }}>
          <Typography variant="h4" gutterBottom>Payment Confirmed</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>Thank you for your purchase!</Typography>
          <Fade in={showSuccess} timeout={500}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          </Fade>
          <Typography variant="body2">Transaction ID: {transactionId}</Typography>
          <Typography variant="body2">Order ID: {orderId}</Typography>
          <Typography variant="body2">Amount: KSH {amount?.toFixed(2)}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Payment Method: {paymentMethod}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleDownloadReceipt} 
            sx={{ mr: 2 }}
          >
            Download Receipt
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleGoToPOS}
          >
            Go to POS
          </Button>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default PaymentConfirmation;
