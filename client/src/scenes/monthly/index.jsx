import React, { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid,
  Button,
} from "@mui/material";
import {
  useGetEmployeesQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
} from "state/api";
import Header from "components/Header";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import DownloadIcon from "@mui/icons-material/Download";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"; // Import Recharts components

const Dashboard = () => {
  const theme = useTheme();

  // Fetch data from APIs
  const { data: employeesData, isLoading: loadingEmployees, error: employeeError } = useGetEmployeesQuery();
  const { data: productsData, isLoading: loadingProducts, error: productError } = useGetProductsQuery();
  const { data: customersData, isLoading: loadingCustomers, error: customerError } = useGetCustomersQuery();
  const { data: transactionsData, isLoading: loadingTransactions, error: transactionError } = useGetTransactionsQuery({
    page: 0,
    pageSize: 1000,
    sort: JSON.stringify({}),
    search: "",
  });

  // Prepare sales data by month
  const salesDataByMonth = useMemo(() => {
    if (!transactionsData || !Array.isArray(transactionsData)) return [];
    const monthlySales = {};

    transactionsData.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });

      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + parseFloat(transaction.cost);
    });

    return Object.entries(monthlySales)
      .map(([monthYear, sales]) => ({ monthYear, sales }))
      .sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));
  }, [transactionsData]);

  // Update the downloadCSV function
  const downloadCSV = () => {
    if (!transactionsData || !Array.isArray(transactionsData)) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Product,Quantity,Price\n"
      + transactionsData.map(t => 
          `${t.date},${t.productId},${t.quantity},${t.cost}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_report.csv");
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

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Summary Cards  */}

        {/* New Line Chart for Sales by Month */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales by Month</Typography>
              {loadingTransactions ? (
                <CircularProgress />
              ) : transactionError ? (
                <Alert severity="error">Failed to load sales data!</Alert>
              ) : salesDataByMonth.length === 0 ? (
                <Typography>No sales data available.</Typography>
              ) : (
                <LineChart
                  width={800}
                  height={400}
                  data={salesDataByMonth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="monthYear" 
                    tickFormatter={(value) => value.split(' ')[0].substring(0, 3)}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Other cards remain unchanged... */}
      </Grid>
    </Box>
  );
};

export default Dashboard;
