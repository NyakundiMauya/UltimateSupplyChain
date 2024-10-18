import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetTransactionsQuery } from "state/api"; // Assuming you have this hook

const SalesLineChart = () => {
  const { data: transactionsData, isLoading, error } = useGetTransactionsQuery({
    page: 0,
    pageSize: 1000,
    sort: JSON.stringify({}),
    search: "",
  });

  const salesData = useMemo(() => {
    if (!transactionsData || !Array.isArray(transactionsData)) return [];
    
    // Process transactions to count sales by day
    const salesCountByDay = transactionsData.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString(); // Format date to MM/DD/YYYY
      acc[date] = (acc[date] || 0) + 1; // Count the number of transactions per day
      return acc;
    }, {});

    // Convert to array for chart
    return Object.entries(salesCountByDay).map(([date, count]) => ({
      date,
      count,
    }));
  }, [transactionsData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load sales data!</Alert>;
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Daily Sales
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesLineChart;
