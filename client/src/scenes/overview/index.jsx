import React, { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button
} from "@mui/material";
import { 
  useGetEmployeesQuery, 
  useGetProductsQuery, 
  useGetCustomersQuery,
  useGetTransactionsQuery
} from "state/api";
import Header from "components/Header";
import DownloadIcon from '@mui/icons-material/Download';
import { ResponsiveContainer, Tooltip, Legend, ComposedChart, Bar, XAxis, YAxis } from 'recharts';

const Dashboard = () => {
  const theme = useTheme();

  const { data: employeesData, isLoading: loadingEmployees, error: employeeError } = useGetEmployeesQuery();
  const { data: productsData, isLoading: loadingProducts, error: productError } = useGetProductsQuery();
  const { data: customersData, isLoading: loadingCustomers, error: customerError } = useGetCustomersQuery();
  const { data: transactionsData, isLoading: loadingTransactions, error: transactionError } = useGetTransactionsQuery({
    page: 0,
    pageSize: 1000,
    sort: JSON.stringify({}),
    search: "",
  });

  const waterfallChartData = useMemo(() => {
    if (!transactionsData) return [];
    
    const totalRevenue = transactionsData.reduce((sum, transaction) => sum + parseFloat(transaction.cost), 0);
    
    const categorizedRevenue = transactionsData.reduce((acc, transaction) => {
      const category = transaction.products[0]?.category || 'Uncategorized';
      if (!acc[category]) acc[category] = 0;
      acc[category] += parseFloat(transaction.cost);
      return acc;
    }, {});

    const sortedCategories = Object.entries(categorizedRevenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

    const otherRevenue = totalRevenue - sortedCategories.reduce((sum, [, value]) => sum + value, 0);

    return [
      { name: 'Total Revenue', value: totalRevenue, fill: '#8884d8' },
      ...sortedCategories.map(([category, value]) => ({ 
        name: category, 
        value: -value,
        fill: '#82ca9d' 
      })),
      { name: 'Other', value: -otherRevenue, fill: '#ffc658' },
      { name: 'Net Revenue', value: 0, fill: '#ff7300' }
    ];
  }, [transactionsData]);

  const downloadCSV = () => {
    if (!transactionsData) {
      alert('No data available to download');
      return;
    }

    const headers = ['Date', 'Product', 'Customer', 'Cost'];
    const csvContent = [
      headers.join(','),
      ...transactionsData.map(transaction => 
        [
          transaction.createdAt,
          transaction.products.map(p => p.name).join(';'),
          transaction.userId,
          transaction.cost
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={downloadCSV}
        >
          Download Report
        </Button>
      </Box>

      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Revenue Breakdown</Typography>
          {loadingTransactions || loadingEmployees || loadingProducts || loadingCustomers ? (
            <CircularProgress />
          ) : transactionError || employeeError || productError || customerError ? (
            <Alert severity="error">Failed to load data!</Alert>
          ) : !transactionsData || transactionsData.length === 0 || waterfallChartData.length === 0 ? (
            <Typography>No data available.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={waterfallChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;