import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Changed from 'dark' to 'light'
    primary: {
      main: '#333333', // Kept dark grey as primary color
      light: '#4a4a4a',
      dark: '#1a1a1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff', // Kept white as secondary color
      contrastText: '#333333',
    },
    background: {
      default: '#ffffff', // Changed to white
      paper: '#f5f5f5', // Changed to light grey for cards
    },
    text: {
      primary: '#333333', // Changed to dark grey
      secondary: '#666666', // Changed to medium grey
    },
  },
  typography: {
    fontFamily: [
      'SF Pro Display', // Apple Sans Pro
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
