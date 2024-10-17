import React, { useMemo } from "react";
import FlexBetween from "components/FlexBetween";
import {
  DownloadOutlined,
  PointOfSale,
  ShoppingCart,
  TrendingUp,
  People,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  useGetDashboardQuery,
  useGetEmployeesQuery,
  useGetProductsQuery
} from "state/api";
import StatBox from "components/StatBox";
import Header from "components/Header";



const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardQuery(null, {
    pollingInterval: 30000, // Poll every 30 seconds
  });
  const { data: employeesData } = useGetEmployeesQuery();
  const { data: productsData } = useGetProductsQuery();

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

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    if (!previous) return "N/A";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };

  const handleDownloadReports = () => {
    const dashboardData = data || {};
    const products = productsData || [];

    const escapeCSV = (text) => {
      if (typeof text !== 'string') return text;
      return `"${text.replace(/"/g, '""')}"`;
    };

    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Dashboard Report\n";
    Object.entries(dashboardData).forEach(([key, value]) => {
      csvContent += `${escapeCSV(key)},${escapeCSV(value)}\n`;
    });

    csvContent += "\n";

    csvContent += "Employees by Category Report\n";
    csvContent += "Category,Employees Count,Total Salary\n";
    employeesByCategory.forEach((category) => {
      csvContent += `${escapeCSV(category.category)},${category.count},${category.totalSalary.toFixed(2)}\n`;
    });

    csvContent += "\n";

    // Add products data
    csvContent += "Products Report\n";
    csvContent += "ID,Name,Price,Category,Rating,Supply\n";
    products.forEach((product) => {
      csvContent += `${escapeCSV(product._id)},${escapeCSV(product.name)},$${product.price.toFixed(2)},${escapeCSV(product.category)},${product.rating},${product.supply}\n`;
    });

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const revenueChange = data ? calculatePercentageChange(data.totalRevenue, data.previousMonthRevenue) : "N/A";
  const ordersChange = data ? calculatePercentageChange(data.newOrders, data.previousMonthOrders) : "N/A";
  const customersChange = data ? calculatePercentageChange(data.totalCustomers, data.previousMonthCustomers) : "N/A";
  const profitChange = data ? calculatePercentageChange(data.totalProfit, data.previousMonthProfit) : "N/A";

  const renderLoadingSpinner = () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <CircularProgress size={20} />
    </Box>
  );

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Button
          onClick={handleDownloadReports}
          variant="contained"
          color="primary"
          startIcon={<DownloadOutlined />}
          sx={{
            mb: 2,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Download Reports
        </Button>
      </FlexBetween>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <StatBox
                title="Total Revenue"
                value={data ? `$${data.totalRevenue.toLocaleString()}` : renderLoadingSpinner()}
                increase={revenueChange}
                description="vs. Last Month"
                icon={
                  <TrendingUp
                    sx={{ color: theme.palette.success.main, fontSize: "26px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <StatBox
                title="New Orders"
                value={data ? data.newOrders : renderLoadingSpinner()}
                increase={ordersChange}
                description="vs. Last Month"
                icon={
                  <ShoppingCart
                    sx={{ color: theme.palette.info.main, fontSize: "26px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <StatBox
                title="Total Customers"
                value={data ? data.totalCustomers : renderLoadingSpinner()}
                increase={customersChange}
                description="vs. Last Month"
                icon={
                  <People
                    sx={{ color: theme.palette.warning.main, fontSize: "26px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <StatBox
                title="Total Profit"
                value={data ? `$${data.totalProfit.toLocaleString()}` : renderLoadingSpinner()}
                increase={profitChange}
                description="vs. Last Month"
                icon={
                  <PointOfSale
                    sx={{ color: theme.palette.error.main, fontSize: "26px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employees by Category
              </Typography>
              <Table 
                size="small" 
                aria-label="employee categories table"
                sx={{
                  '& .MuiTableCell-root': {
                    borderColor: theme.palette.grey[300],
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Employees</TableCell>
                    <TableCell align="right">Total Salary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeesByCategory.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell component="th" scope="row">
                        {row.category}
                      </TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                      <TableCell align="right">
                        ${row.totalSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Future Content
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
