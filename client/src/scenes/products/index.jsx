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
          sx={{
            mt: "40px",
            height: "75vh",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={data || []}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            sx={{
              border: "none",
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderBottom: "2px solid #e0e0e0",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                borderTop: "none",
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: theme.palette.background.paper,
                padding: "8px 16px",
                "& .MuiButton-root": {
                  color: theme.palette.primary.main,
                },
              },
              "& .MuiDataGrid-row": {
                "&:nth-of-type(even)": {
                  backgroundColor: theme.palette.action.hover,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.selected,
                },
              },
            }}
          />
        </Paper>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Box>
  );
};

export default Products;
