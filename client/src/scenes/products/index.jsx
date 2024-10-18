import React, { useState } from "react";
import {
  Box,
  useTheme,
  Typography,
  Rating,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "components/Header";
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from "state/api";
import "./index.css"; 

const Products = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => `Ksh ${Number(params.value).toFixed(2)}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 1,
      renderCell: (params) => <Rating value={params.value} readOnly />,
    },
  ];

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentProduct(null);
    setOpenDialog(false);
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData.entries());

    if (currentProduct) {
      await updateProduct({ id: currentProduct._id, ...productData });
    } else {
      await createProduct(productData);
    }

    handleCloseDialog();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    renderCell: (params) => (
      <Box>
        <Button onClick={() => handleOpenDialog(params.row)}>Edit</Button>
        <Button onClick={() => handleDeleteProduct(params.row._id)}>Delete</Button>
      </Box>
    ),
  };

  const allColumns = [...columns, actionColumn];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Products" subtitle="Manage your product list." />
      <Button onClick={() => handleOpenDialog()} style={{ marginBottom: '1rem' }}>Add New Product</Button>
      {data || !isLoading ? (
        <Paper elevation={3} className="products-paper">
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={data || []}
            columns={allColumns}
            components={{ Toolbar: GridToolbar }}
            className="products-data-grid"
          />
        </Paper>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <form onSubmit={handleSaveProduct}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              defaultValue={currentProduct?.name || ""}
            />
            <TextField
              margin="dense"
              name="category"
              label="Category"
              type="text"
              fullWidth
              defaultValue={currentProduct?.category || ""}
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              defaultValue={currentProduct?.price || ""}
            />
            <TextField
              margin="dense"
              name="rating"
              label="Rating"
              type="number"
              fullWidth
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              defaultValue={currentProduct?.rating || ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Products;
