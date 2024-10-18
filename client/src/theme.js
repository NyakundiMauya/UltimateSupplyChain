// src/theme.js

import { createTheme } from '@mui/material/styles';

export const tokensDark = {
  grey: {
    0: "#ffffff", 
    10: "#fafafa", 
    50: "#f5f5f5",
    100: "#e0e0e0",
     200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#8a8a8a", 
    500: "#666666",
    600: "#525252",
    700: "#424242", 
    800: "#303030",
    900: "#212121", 
    1000: "#000000", 
  },
  primary: {
    100: "#e8f0fe",
    200: "#d0e3fc",
    300: "#a6c8ff",
    400: "#4285f4", 
    500: "#3367d6",
    600: "#2856b8", 
    700: "#1a45a0",
    800: "#12357e",
    900: "#0b2462",
  },
  secondary: {
    100: "#fff8e1",
    200: "#ffecb3",
    300: "#ffe082",
    400: "#ffca28",
    500: "#ffc107",
    600: "#ffb300",
    700: "#ffa000",
    800: "#ff8f00",
    900: "#ff6f00",
  },
};

export const themeSettings = () => {
  return {
    palette: {
      primary: {
        ...tokensDark.primary,
        main: tokensDark.primary[400], 
        light: tokensDark.primary[300],
        dark: tokensDark.primary[600],
      },
      secondary: {
        ...tokensDark.secondary,
        main: tokensDark.secondary[500],
      },
      neutral: {
        ...tokensDark.grey,
        main: tokensDark.grey[400],
      },
      background: {
        default: "#202124", 
        paper: "#303134", 
      },
      text: {
        primary: "#ffffff", 
        secondary: "#e8eaed", 
      },
      action: {
        active: "#8ab4f8", 
        hover: "rgba(138, 180, 248, 0.12)", 
      },
    },
    typography: {
      fontFamily: '"Google Sans", sans-serif',
      fontSize: 14,
      h1: {
        fontSize: "0.75rem",
        fontWeight: 500,
      },
      h2: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontWeight: 300,
        fontSize: 60,
      },
      h3: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontWeight: 400,
        fontSize: 48,
      },
      h4: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontWeight: 400,
        fontSize: 34,
      },
      h5: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontWeight: 400,
        fontSize: 24,
      },
      h6: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontWeight: 500,
        fontSize: 20,
      },
      button: {
        fontWeight: 500,
        textTransform: "none",
      },
      body1: {
        fontSize: "0.875rem",
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: "0 24px 24px 0",
            marginRight: "16px",
            marginLeft: "8px",
            marginBottom: "0.5rem",
            "&.Mui-selected": {
              backgroundColor: "rgba(138, 180, 248, 0.12)",
              fontWeight: 500,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: "40px",
            color: "#9aa0a6",
          },
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            margin: "1.5rem 0 0.5rem 1.5rem",
            fontSize: "0.75rem",
            fontWeight: 500,
          },
        },
      },
    },
  };
};

export const createCustomTheme = () => createTheme(themeSettings());
