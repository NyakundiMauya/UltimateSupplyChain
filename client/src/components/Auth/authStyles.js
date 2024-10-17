import { styled } from '@mui/material/styles';
import { Button, TextField, Box, Typography } from '@mui/material';

export const AuthContainer = styled(Box)(({ theme }) => ({
  maxWidth: '400px',
  margin: 'calc(50vh - 200px) auto 0', // 
  fontFamily: '"San Francisco Pro", sans-serif',
  backgroundColor: theme.palette.grey[800], // 
  color: theme.palette.text.primary, // 
  padding: '20px', //
  borderRadius: '8px', //
  boxShadow: theme.shadows[3], // 
  
  transform: 'translateY(-50%)', // 

  ring
}));

// Styled form
export const AuthForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Center align items
  gap: '15px',
});

// Styled input (TextField component from MUI)
export const AuthInput = styled(TextField)(({ theme }) => ({
  width: '100%', // Full width
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.text.secondary, // 
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main, // 
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main, // 
    },
  },
  input: {
    color: theme.palette.text.primary, //  text color
    backgroundColor: theme.palette.grey[700], // Input  (darker grey)
  },
}));

// Styled button
export const AuthButton = styled(Button)(({ theme }) => ({
  padding: '10px',
  fontSize: '16px',
  backgroundColor: theme.palette.primary.main, // 
  color: '#fff', // White text
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: '"San Francisco Pro", sans-serif',
  textTransform: 'none',
  border: '2px solid #fff', // 
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // 
    borderColor: theme.palette.primary.dark, // 
  },
}));

// Styled error message
export const AuthError = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main, // 
  fontFamily: '"San Francisco Pro", sans-serif',
  textAlign: 'center', 
}));
