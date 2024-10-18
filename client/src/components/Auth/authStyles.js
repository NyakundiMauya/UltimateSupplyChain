import { styled } from '@mui/material/styles';
import { Button, TextField, Box, Typography } from '@mui/material';

export const AuthContainer = styled(Box)(({ theme }) => ({
  maxWidth: '400px',
  margin: 'calc(50vh - 200px) auto 0',
  fontFamily: '"SF Pro Display", "Roboto", sans-serif',
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.text.primary,
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%)',
  transform: 'translateY(-50%)',
}));

export const AuthForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
});

export const AuthInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    '& fieldset': {
      borderColor: theme.palette.text.secondary,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  input: {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    padding: '12px 16px',
  },
  '& .MuiOutlinedInput-root, & .MuiOutlinedInput-root:hover, & .MuiOutlinedInput-root.Mui-focused': {
    boxShadow: 'none',
  },
}));

export const AuthButton = styled(Button)(({ theme }) => ({
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  borderRadius: '24px',
  cursor: 'pointer',
  fontFamily: '"SF Pro Text", "Roboto", sans-serif',
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
  },
}));

export const AuthError = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontFamily: '"SF Pro Text", "Roboto", sans-serif',
  fontSize: '14px',
  marginTop: '8px',
  textAlign: 'center', 
}));

export const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '15px',
});
