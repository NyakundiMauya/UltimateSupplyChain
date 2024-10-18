import React from "react";
import {
  Box,
  useTheme,
  Typography,
  Rating,
  Paper,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";
import "./index.css"; 

const Products = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetProductsQuery();

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 1,
      renderCell: (params) => <Rating value={params.value} readOnly />,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Products" subtitle="See your list of products." />
      {data || !isLoading ? (
        <Paper
          elevation={3}
          className="products-paper"
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={data || []}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            className="products-data-grid"
          />
        </Paper>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Box>
  );
};

export default Products;
