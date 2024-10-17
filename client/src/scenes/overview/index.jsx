import React, { useState } from "react";
import { FormControl, MenuItem, InputLabel, Box, Select, ThemeProvider, createTheme } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import Header from "components/Header";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#202124',
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
    fontSize: 14,
    h6: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '0 24px 24px 0',
          marginRight: '16px',
          marginLeft: '8px',
          marginBottom: '0.5rem',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '40px',
        },
      },
    },
  },
});

const Overview = () => {
  const [view, setView] = useState("units");

  // Sample data for the chart
  const chartData = {
    sales: [
      { date: '2023-01-01', value: 1000 },
      { date: '2023-02-01', value: 1200 },
      { date: '2023-03-01', value: 900 },
      { date: '2023-04-01', value: 1500 },
      { date: '2023-05-01', value: 2000 },
    ],
    units: [
      { date: '2023-01-01', value: 100 },
      { date: '2023-02-01', value: 120 },
      { date: '2023-03-01', value: 90 },
      { date: '2023-04-01', value: 150 },
      { date: '2023-05-01', value: 200 },
    ],
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box m="1.5rem 2.5rem" bgcolor="background.default" color="text.primary">
        <Header
          title="OVERVIEW"
          subtitle="Overview of general revenue and profit"
        />
        <Box height="75vh">
          <FormControl sx={{ mt: "1rem", mb: "2rem" }}>
            <InputLabel sx={{ color: 'text.secondary' }}>View</InputLabel>
            <Select
              value={view}
              label="View"
              onChange={(e) => setView(e.target.value)}
              sx={{
                color: 'text.primary',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.secondary',
                },
              }}
            >
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="units">Units</MenuItem>
            </Select>
          </FormControl>
          <LineChart
            xAxis={[{ 
              data: chartData[view].map(item => new Date(item.date)),
              scaleType: 'time',
            }]}
            series={[
              {
                data: chartData[view].map(item => item.value),
                color: '#ffffff',
              },
            ]}
            width={800}
            height={400}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Overview;
