import React, { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DownloadIcon from '@mui/icons-material/Download';
import { ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';

const Overview = () => {
  const theme = useTheme();

  const { data: transactionsData, isLoading: loadingTransactions, error: transactionError } = useGetTransactionsQuery({
    page: 0,
    pageSize: 1000,
    sort: JSON.stringify({}),
    search: "",
  });

  const salesByMonth = useMemo(() => {
    if (!transactionsData) return [];
    
    const salesMap = {};
    transactionsData.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!salesMap[monthYear]) {
        salesMap[monthYear] = 0;
      }
      salesMap[monthYear] += parseFloat(transaction.amount);
    });

    return Object.entries(salesMap)
      .map(([date, total]) => ({ date, total: Number(total.toFixed(2)) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [transactionsData]);

  const yearlySales = useMemo(() => {
    if (!transactionsData) return [];
    
    const salesMap = {};
    transactionsData.forEach(transaction => {
      const year = new Date(transaction.createdAt).getFullYear();
      if (!salesMap[year]) {
        salesMap[year] = 0;
      }
      salesMap[year]++;
    });

    return Object.entries(salesMap)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => b.year - a.year);
  }, [transactionsData]);

  const downloadCSV = () => {
    if (!transactionsData) {
      alert('No data available to download');
      return;
    }

    const headers = ['Date', 'Product', 'Customer', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactionsData.map(transaction => 
        [
          transaction.createdAt,
          transaction.products.map(p => p.name).join(';'),
          transaction.userId,
          transaction.amount
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
        <Header title="OVERVIEW" subtitle="Sales overview and yearly transactions" />
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
          <Typography variant="h6" gutterBottom>Monthly Sales Overview</Typography>
          {loadingTransactions ? (
            <CircularProgress />
          ) : transactionError ? (
            <Alert severity="error">Failed to load data!</Alert>
          ) : !salesByMonth || salesByMonth.length === 0 ? (
            <Typography>No data available.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={salesByMonth}
                margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ 
                    value: 'Sales in Shillings', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip formatter={(value) => `${value} Shillings`} />
                <Legend />
                <Bar dataKey="total" fill={theme.palette.primary.main} name="Sales">
                  <LabelList dataKey="total" position="top" formatter={(value) => `${value} Sh`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Yearly Transaction Count</Typography>
          {loadingTransactions ? (
            <CircularProgress />
          ) : transactionError ? (
            <Alert severity="error">Failed to load data!</Alert>
          ) : !yearlySales || yearlySales.length === 0 ? (
            <Typography>No data available.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Year</TableCell>
                    <TableCell align="right">Number of Transactions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yearlySales.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell component="th" scope="row">
                        {row.year}
                      </TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Overview;
