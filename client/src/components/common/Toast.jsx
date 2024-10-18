import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  animation: `${slideIn} 0.3s ease-out`,
}));

const ToastButtons = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const Toast = ({ message, onAccept, onDecline }) => {
  return (
    <ToastContainer elevation={3}>
      <Typography variant="body1">{message}</Typography>
      <ToastButtons>
        <Button variant="contained" color="primary" onClick={onAccept}>
          Accept
        </Button>
        <Button variant="outlined" color="primary" onClick={onDecline}>
          Decline
        </Button>
      </ToastButtons>
    </ToastContainer>
  );
};
