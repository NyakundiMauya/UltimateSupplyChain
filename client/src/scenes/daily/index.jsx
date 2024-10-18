import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useGetTransactionsQuery } from "state/api"; // Assuming you have this hook
import Header from "components/Header"; // Add this import


const DailyTransactionsChart = () => {
  const theme = useTheme();
  const { data: transactionsData, isLoading, error } = useGetTransactionsQuery({
    page: 0,
    pageSize: 1000,
    sort: JSON.stringify({}),
    search: "",
  });

  const dailyTransactions = useMemo(() => {
    if (!transactionsData || !Array.isArray(transactionsData)) return [];
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const transactionsByDay = daysOfWeek.map(day => ({ day, count: 0 }));

    transactionsData.forEach(transaction => {
      const dayIndex = new Date(transaction.createdAt).getDay();
      transactionsByDay[dayIndex].count++;
    });

    return transactionsByDay;
  }, [transactionsData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load transaction data!</Alert>;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY TRANSACTIONS" subtitle="Chart of daily transaction counts" />
      <Box mt="40px">
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Transactions
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={dailyTransactions}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis 
                  label={{ 
                    value: 'Number of Transactions', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke={theme.palette.primary.main} 
                  activeDot={{ r: 8 }}
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DailyTransactionsChart;
