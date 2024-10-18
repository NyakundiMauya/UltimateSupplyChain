import React from 'react';
import { Box, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useGetProductsQuery, useGetStoresQuery } from 'state/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Inventory = () => {
  const { data: storesData, isLoading: storesLoading } = useGetStoresQuery();
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery();

  const renderStoreInventory = () => {
    if (storesLoading || productsLoading) {
      return <CircularProgress />;
    }

    if (!storesData || !productsData) {
      return <Typography>No data available</Typography>;
    }

    const productColumns = [
      { field: 'name', headerName: 'Product Name', flex: 1 },
      { field: 'category', headerName: 'Category', flex: 1 },
      { field: 'price', headerName: 'Price (KSH)', flex: 0.5, valueFormatter: ({ value }) => `KSH ${value.toFixed(2)}` },
      { field: 'supply', headerName: 'Supply', flex: 0.5 },
    ];

    return (
      <>
        {storesData.map((store) => (
          <Accordion key={store._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{store.branch} - {store.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={productsData.map(product => ({
                    id: product._id,
                    ...product,
                    supply: Math.floor(Math.random() * 100) // Simulated supply for this store
                  }))}
                  columns={productColumns}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ m: "1.5rem 0 0.5rem 1.5rem" }}>Store Inventory</Typography>
      <Box sx={{ padding: '1rem' }}>
        {renderStoreInventory()}
      </Box>
    </Box>
  );
};

export default Inventory;
