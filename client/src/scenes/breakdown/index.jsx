import React, { useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Button,
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import {
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "state/api";
import Header from "components/Header";
import DownloadIcon from '@mui/icons-material/Download';
import './index.css';

const Breakdown = () => {
  const theme = useTheme();

  // Fetch data from APIs
  const { data: productsData, isLoading: loadingProducts, error: productError } = useGetProductsQuery();
  const { data: transactionsData, isLoading: loadingTransactions, error: transactionError } = useGetTransactionsQuery({
    page: 0,
    pageSize: 1000,
    sort: JSON.stringify({}),
    search: "",
  });

  // Calculate transactionsByCategory
  const transactionsByCategory = useMemo(() => {
    if (!transactionsData || !productsData) return [];
    
    const categoryTransactions = {};
    let totalTransactions = 0;

    transactionsData.forEach(transaction => {
      transaction.products.forEach(productEntry => {
        const product = productsData.find(p => p._id.toString() === productEntry.product.toString());
        if (product) {
          const category = product.category;
          if (!categoryTransactions[category]) {
            categoryTransactions[category] = 0;
          }
          categoryTransactions[category]++;
          totalTransactions++;
        }
      });
    });

    return Object.entries(categoryTransactions).map(([name, value]) => ({
      id: name,
      value,
      label: `${name}: ${((value / totalTransactions) * 100).toFixed(1)}%`,
    }));
  }, [transactionsData, productsData]);

  // Generate colors based on the number of categories
  const colors = useMemo(() => {
    return transactionsByCategory.map((_, index) => 
      theme.palette.augmentColor({
        color: {
          main: `hsl(${(index * 137.5) % 360}, 50%, 50%)`,
        },
      }).main
    );
  }, [transactionsByCategory, theme.palette]);

  return (
    <Box className="dashboard-container">
      <Box className="dashboard-header" sx={{ marginBottom: 3 }}>
        <Header title="BREAKDOWN" subtitle="Breakdown of Transactions By Category" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          // Your download function here
        >
          Download Report
        </Button>
      </Box>

      <Grid container spacing={3} className="dashboard-grid">
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transactions by Product Category
              </Typography>
              {loadingProducts || loadingTransactions ? (
                <CircularProgress />
              ) : productError || transactionError ? (
                <Alert severity="error">Failed to load transaction data!</Alert>
              ) : transactionsByCategory.length === 0 ? (
                <Typography>No transaction data available.</Typography>
              ) : (
                <Box className="pie-chart-container">
                  <PieChart
                    series={[
                      {
                        data: transactionsByCategory,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                        arcLabel: null,
                      },
                    ]}
                    colors={colors}
                    height={400}
                    legend={{ hidden: true }}
                  />
                  <Box className="legend-container">
                    {transactionsByCategory.map((category, index) => (
                      <Box key={category.id} className="legend-item">
                        <Box
                          className="legend-color"
                          style={{ backgroundColor: colors[index] }}
                        />
                        <Typography variant="body2" className="legend-label">
                          {category.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Breakdown;
