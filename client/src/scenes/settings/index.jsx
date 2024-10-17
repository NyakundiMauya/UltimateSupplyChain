import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, createTheme, ThemeProvider } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#202124',
      paper: '#202124',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e8eaed',
    },
    primary: {
      main: '#8ab4f8',
    },
    action: {
      hover: 'rgba(138, 180, 248, 0.12)',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h4: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: '0 24px 24px 0',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: '0 24px 24px 0',
          marginRight: '16px',
          marginLeft: '8px',
          '&:hover': {
            backgroundColor: 'rgba(138, 180, 248, 0.12)',
          },
        },
      },
    },
  },
});

const Settings = () => {
  const [settings, setSettings] = useState({
    currency: '',
    language: '',
  });

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'KES'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Swahili'];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('Settings saved successfully!');
    
        console.log('New settings:', settings);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, backgroundColor: '#202124', color: '#ffffff' }}>
        <Typography variant="h4" gutterBottom sx={{ m: "1.5rem 0 0.5rem 1.5rem" }}>
          Language and Currency Settings
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="language-label" sx={{ color: '#e8eaed' }}>Language</InputLabel>
            <Select
              labelId="language-label"
              name="language"
              value={settings.language}
              onChange={handleChange}
              label="Language"
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9aa0a6',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8ab4f8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8ab4f8',
                },
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="currency-label" sx={{ color: '#e8eaed' }}>Currency</InputLabel>
            <Select
              labelId="currency-label"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              label="Currency"
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9aa0a6',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8ab4f8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8ab4f8',
                },
              }}
            >
              {currencies.map((curr) => (
                <MenuItem key={curr} value={curr}>{curr}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ marginTop: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                backgroundColor: '#8ab4f8', 
                color: '#202124',
                '&:hover': {
                  backgroundColor: 'rgba(138, 180, 248, 0.8)',
                },
              }}
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default Settings;
