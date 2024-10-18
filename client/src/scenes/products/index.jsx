import React, { useState, useEffect } from "react";
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
import { darken, lighten } from "@mui/material/styles";

const Products = () => {
  const theme = useTheme();
  const { data, isLoading, refetch } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    branchCode: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [flattenedData, setFlattenedData] = useState([]);

  useEffect(() => {
    if (data) {
      const flattened = data.flatMap(product => 
        product.supply.map(supply => ({
          _id: `${product._id}-${supply.branchCode}`,
          ...product,
          branchCode: supply.branchCode,
          amount: supply.amount,
        }))
      );
      setFlattenedData(flattened);
    }
  }, [data]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        category: selectedProduct.category || "",
        price: selectedProduct.price || "",
        rating: selectedProduct.rating || "",
        branchCode: "",
        amount: "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        rating: "",
        branchCode: "",
        amount: "",
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.5,
      renderCell: (params) => params.value.toFixed(1),
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      flex: 0.5,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleOpenDialog(params.row)}>Edit</Button>
          <Button onClick={() => handleDeleteProduct(params.row._id.split('-')[0], params.row.branchCode)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    setFormData({
      name: product?.name || "",
      category: product?.category || "",
      price: product?.price || "",
      rating: product?.rating || "",
      branchCode: product?.branchCode || "",
      amount: product?.amount || "",
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOpen(false);
  };

  const handleSaveProduct = async () => {
    try {
      setError("");
      
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        supply: [{ branchCode: formData.branchCode, amount: parseInt(formData.amount) }],
      };

      if (selectedProduct) {
        // Updating existing product
        const existingProduct = data.find(p => p._id === selectedProduct._id.split('-')[0]);
        const updatedSupply = existingProduct.supply.map(s => 
          s.branchCode === formData.branchCode 
            ? { ...s, amount: parseInt(formData.amount) }
            : s
        );
        if (!updatedSupply.some(s => s.branchCode === formData.branchCode)) {
          updatedSupply.push({ branchCode: formData.branchCode, amount: parseInt(formData.amount) });
        }
        await updateProduct({
          id: existingProduct._id,
          ...productData,
          supply: updatedSupply,
        });
      } else {
        // Creating new product
        await createProduct(productData);
      }
      refetch();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product:", error);
      setError("An error occurred while saving the product.");
    }
  };

  const handleDeleteProduct = async (productId, branchCode) => {
    try {
      const originalProduct = data.find(p => p._id === productId);
      if (originalProduct.supply.length > 1) {
        // If there's more than one supply, just remove the specific branch
        const updatedSupply = originalProduct.supply.filter(s => s.branchCode !== branchCode);
        await updateProduct({
          id: originalProduct._id,
          supply: updatedSupply,
        });
      } else {
        // If it's the last supply, delete the entire product
        await deleteProduct(originalProduct._id);
      }
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("An error occurred while deleting the product.");
    }
  };

  const getBackgroundColor = (color, mode) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

  const getHoverBackgroundColor = (color, mode) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="Managing products and inventory" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "5px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: theme.palette.secondary[100],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.default,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
          "& .MuiDataGrid-row": {
            backgroundColor: theme.palette.background.default,
            "&:hover": {
              backgroundColor: getHoverBackgroundColor(theme.palette.background.default, theme.palette.mode),
            },
          },
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
            borderRight: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-columnsContainer, & .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Button 
          onClick={() => handleOpenDialog()} 
          variant="contained" 
          style={{ marginBottom: "1rem", backgroundColor: theme.palette.secondary.main }}
        >
          Add Product
        </Button>
        <DataGrid
          loading={isLoading || !flattenedData}
          getRowId={(row) => row._id}
          rows={flattenedData || []}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" variant="body2" style={{ marginBottom: "1rem" }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Rating"
            name="rating"
            type="number"
            value={formData.rating}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Branch Code"
            name="branchCode"
            value={formData.branchCode}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
