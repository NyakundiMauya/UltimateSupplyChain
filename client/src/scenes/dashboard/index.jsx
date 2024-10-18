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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Button
} from "@mui/material";
import { 
  useGetEmployeesQuery, 
  useGetProductsQuery, 
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetExpensesQuery // Add this new import
} from "state/api";
import Header from "components/Header";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';
import MoneyOffIcon from '@mui/icons-material/MoneyOff'; // Import a new icon for expenses
import './index.css'; // Import the CSS file

const Dashboard = () => {
  const theme = useTheme();

  // Fetch data from APIs
  const { data: employeesData, isLoading: loadingEmployees, error: employeeError } = useGetEmployeesQuery();
  const { data: productsData, isLoading: loadingProducts, error: productError } = useGetProductsQuery();
  const { data: customersData, isLoading: loadingCustomers, error: customerError } = useGetCustomersQuery();

  // Add this new query
  const { data: transactionsData, isLoading: loadingTransactions, error: transactionError } = useGetTransactionsQuery({
    page: 0,
    pageSize: 1000, // Adjust this value based on your needs
    sort: JSON.stringify({}),
    search: "",
  });

  // Add this new query
  const { data: expensesData, isLoading: loadingExpenses, error: expenseError } = useGetExpensesQuery();

  // Calculate employees by category
  const employeesByCategory = useMemo(() => {
    if (!employeesData) return [];
    const categories = {};
    employeesData.forEach((employee) => {
      if (!categories[employee.category]) {
        categories[employee.category] = { count: 0, totalSalary: 0 };
      }
      categories[employee.category].count++;
      categories[employee.category].totalSalary += employee.salary || 0;
    });
    return Object.entries(categories).map(([category, data]) => ({
      category,
      count: data.count,
      totalSalary: data.totalSalary,
    }));
  }, [employeesData]);

  // Calculate total salary of all employees
  const totalSalary = useMemo(() => {
    if (!employeesData) return 0;
    return employeesData.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  }, [employeesData]);

  // Calculate products by category and total supply
  const productsByCategory = useMemo(() => {
    if (!productsData) return [];
    const categories = {};
    productsData.forEach((product) => {
      if (!categories[product.category]) {
        categories[product.category] = { totalSupply: 0 };
      }
      categories[product.category].totalSupply += product.supply || 0;
    });
    return Object.entries(categories).map(([category, data]) => ({
      category,
      totalSupply: data.totalSupply,
    }));
  }, [productsData]);

  // Calculate new customer growth percentage for this month
  const newCustomerGrowth = useMemo(() => {
    if (!customersData) return { current: 0, last: 0, percentage: 0 };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const countNewCustomers = (startDate, endDate) =>
      customersData.filter((customer) => {
        const createdAt = new Date(customer.createdAt);
        return createdAt >= startDate && createdAt < endDate;
      }).length;

    const currentMonthCustomers = countNewCustomers(startOfMonth, now);
    const lastMonthCustomers = countNewCustomers(startOfLastMonth, endOfLastMonth);

    const percentage = lastMonthCustomers
      ? ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 100;

    return { current: currentMonthCustomers, last: lastMonthCustomers, percentage };
  }, [customersData]);

  // Update the productTransactionCounts calculation
  const productTransactionCounts = useMemo(() => {
    if (!transactionsData || !productsData) return [];

    console.log('First transaction:', transactionsData[0]);
    console.log('First product:', productsData[0]);

    const counts = {};
    transactionsData.forEach(transaction => {
      if (transaction.products && Array.isArray(transaction.products)) {
        transaction.products.forEach(productEntry => {
          if (productEntry.product) {
            const productId = productEntry.product.toString();
            counts[productId] = (counts[productId] || 0) + 1;
          }
        });
      }
    });

    console.log('Transaction counts:', counts);

    const productsWithTransactions = productsData
      .map(product => {
        const productId = product._id.toString();
        return {
          id: productId,
          name: product.name,
          transactionCount: counts[productId] || 0
        };
      })
      .filter(product => product.transactionCount > 0)
      .sort((a, b) => b.transactionCount - a.transactionCount);

    console.log('Products with transactions:', productsWithTransactions);

    return productsWithTransactions;
  }, [transactionsData, productsData]);

  // Get top 5 trending products
  const trendingProducts = useMemo(() => {
    return productTransactionCounts.slice(0, 5);
  }, [productTransactionCounts]);

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    if (!transactionsData) return 0;
    return transactionsData.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [transactionsData]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    if (!expensesData || !employeesData) return 0;
    const expensesSum = expensesData.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    const salarySum = employeesData.reduce((sum, employee) => {
      return sum + (employee.salary || 0);
    }, 0);
    return expensesSum + salarySum;
  }, [expensesData, employeesData]);

  // Update the currency formatter
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    let formatted;
    if (amount >= 1000000) {
      formatted = new Intl.NumberFormat('en-KE', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount / 1000000) + 'M';
    } else {
      formatted = formatter.format(amount).replace(/^KSh\s?/, '');
    }
    
    return formatted;
  };

  // Function to generate CSV content
  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add summary data
    csvContent += "Summary\n";
    csvContent += `Total Employees,${employeesData?.length || 0}\n`;
    csvContent += `Total Products,${productsData?.length || 0}\n`;
    csvContent += `New Customers Growth,${newCustomerGrowth.percentage.toFixed(1)}%\n`;
    csvContent += `Total Revenue,${formatCurrency(totalRevenue)}\n\n`;

    // Add employees by category
    csvContent += "Employees by Category\n";
    csvContent += "Category,Count,Total Salary\n";
    employeesByCategory.forEach(row => {
      csvContent += `${row.category},${row.count},${formatCurrency(row.totalSalary)}\n`;
    });
    csvContent += `Total,,${formatCurrency(totalSalary)}\n\n`;

    // Add products by category
    csvContent += "Product Categories and Supply\n";
    csvContent += "Category,Total Supply\n";
    productsByCategory.forEach(row => {
      csvContent += `${row.category},${row.totalSupply}\n`;
    });
    csvContent += "\n";

    // Add trending products
    csvContent += "Trending Products\n";
    csvContent += "Rank,Product Name,Transaction Count\n";
    trendingProducts.forEach((product, index) => {
      csvContent += `${index + 1},${product.name},${product.transactionCount}\n`;
    });

    return encodeURI(csvContent);
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    const csv = generateCSV();
    const link = document.createElement("a");
    link.setAttribute("href", csv);
    link.setAttribute("download", "dashboard_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const InvoicesCard = () => {
    if (loadingExpenses) {
      return <CircularProgress />;
    }
  
    if (expenseError) {
      return <Typography color="error">Error loading expenses</Typography>;
    }
  
    const pendingExpenses = expensesData ? expensesData.filter(expense => expense.status === 'pending') : [];
    const totalPending = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Pending Invoices</Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            Total: {formatCurrency(totalPending)}
          </Typography>
          <Paper elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingExpenses.slice(0, 5).map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell align="right">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell align="right">{new Date(expense.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          {pendingExpenses.length > 5 && (
            <Typography variant="body2" color="text.secondary" style={{ marginTop: '8px' }}>
              {pendingExpenses.length - 5} more pending...
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className="dashboard-container">
      <Box className="header-container">
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

      <Grid container spacing={3} className="grid-container">
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3} className="card">
            <CardContent className="card-content">
              <Box className="card-header">
                <Typography variant="h6" gutterBottom>Total Employees</Typography>
                <PeopleIcon color="primary" />
              </Box>
              {loadingEmployees ? (
                <CircularProgress size={20} />
              ) : employeeError ? (
                <Typography color="error">Error</Typography>
              ) : (
                <Typography variant="h4">{employeesData?.length || 0}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3} className="card">
            <CardContent className="card-content">
              <Box className="card-header">
                <Typography variant="h6" gutterBottom>Total Products</Typography>
                <InventoryIcon color="primary" />
              </Box>
              {loadingProducts ? (
                <CircularProgress size={20} />
              ) : productError ? (
                <Typography color="error">Error</Typography>
              ) : (
                <Typography variant="h4">{productsData?.length || 0}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3} className="card">
            <CardContent className="card-content">
              <Box className="card-header">
                <Typography variant="h6" gutterBottom>New Customers</Typography>
                <PersonAddIcon color="primary" />
              </Box>
              {loadingCustomers ? (
                <CircularProgress size={20} />
              ) : customerError ? (
                <Typography color="error">Error</Typography>
              ) : (
                <Box>
                  <Typography variant="h4">
                    {newCustomerGrowth.current}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={newCustomerGrowth.percentage >= 0 ? "green" : "red"}
                  >
                    {newCustomerGrowth.percentage >= 0 ? "+" : ""}
                    {newCustomerGrowth.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3} className="card">
            <CardContent className="card-content">
              <Box className="card-header">
                <Typography variant="h6" gutterBottom>Total Revenue</Typography>
                <AttachMoneyIcon style={{ color: 'green' }} />
              </Box>
              {loadingTransactions ? (
                <CircularProgress size={20} />
              ) : transactionError ? (
                <Typography color="error">Error</Typography>
              ) : (
                <Typography variant="h4" style={{ color: 'green' }}>
                  {formatCurrency(totalRevenue)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3} className="card">
            <CardContent className="card-content">
              <Box className="card-header">
                <Typography variant="h6" gutterBottom>Total Expenses</Typography>
                <MoneyOffIcon style={{ color: 'red' }} />
              </Box>
              {loadingExpenses || loadingEmployees ? (
                <CircularProgress size={20} />
              ) : expenseError || employeeError ? (
                <Typography color="error">Error</Typography>
              ) : (
                <Typography variant="h4" style={{ color: 'red' }}>
                  {formatCurrency(totalExpenses)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Employees by Category */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} className="card">
            <CardContent className="card-content">
              <Typography variant="h6" gutterBottom>Employees by Category</Typography>
              {loadingEmployees ? (
                <Box className="loading-container">
                  <CircularProgress />
                </Box>
              ) : employeeError ? (
                <Alert severity="error">Failed to load employees data!</Alert>
              ) : (
                <Table size="small" className="table-container">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Total Salary</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employeesByCategory.slice(0, 5).map((row) => (
                      <TableRow key={row.category}>
                        <TableCell>{row.category}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(row.totalSalary)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right" className="total-row">
                        Total
                      </TableCell>
                      <TableCell align="right" className="total-row">
                        {formatCurrency(totalSalary)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Products by Category */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} className="card">
            <CardContent className="card-content">
              <Typography variant="h6" gutterBottom>Product Categories and Supply</Typography>
              {loadingProducts ? (
                <Box className="loading-container">
                  <CircularProgress />
                </Box>
              ) : productError ? (
                <Alert severity="error">Failed to load products data!</Alert>
              ) : (
                <Table size="small" className="table-container">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Total Supply</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsByCategory.map((row) => (
                      <TableRow key={row.category}>
                        <TableCell>{row.category}</TableCell>
                        <TableCell align="right">{row.totalSupply}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Trending Products */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Trending Products</Typography>
              {loadingTransactions || loadingProducts ? (
                <CircularProgress />
              ) : transactionError || productError ? (
                <Alert severity="error">Failed to load trending products data!</Alert>
              ) : trendingProducts.length === 0 ? (
                <Typography>No trending products found.</Typography>
              ) : (
                <List dense>
                  {trendingProducts.map((product, index) => (
                    <ListItem key={product.id} disablePadding>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${index + 1}. ${product.name}`} 
                        secondary={`${product.transactionCount} transactions`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Replace the Pending Invoices Table with the new InvoicesCard */}
        <Grid item xs={12} md={6}>
          <InvoicesCard />
        </Grid>

        {/* New Card: Products by Transaction Count */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Products with Transactions</Typography>
              {loadingTransactions || loadingProducts ? (
                <CircularProgress />
              ) : transactionError || productError ? (
                <Alert severity="error">Failed to load product transaction data!</Alert>
              ) : productTransactionCounts.length === 0 ? (
                <Box>
                  <Typography>No products with transactions found.</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total transactions: {transactionsData ? transactionsData.length : 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total products: {productsData ? productsData.length : 0}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Products with transactions: {productTransactionCounts.length}
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell align="right">Transaction Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productTransactionCounts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">{product.transactionCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
