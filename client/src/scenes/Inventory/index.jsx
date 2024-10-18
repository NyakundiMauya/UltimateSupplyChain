import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from 'state/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box m="1.5rem 2.5rem">
          <Typography variant="h4" color="error">Something went wrong</Typography>
          <Typography variant="body1" style={{whiteSpace: 'pre-wrap'}}>
            {this.state.error && this.state.error.toString()}
          </Typography>
          <Typography variant="body2" style={{whiteSpace: 'pre-wrap'}}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(product || { name: '', category: '', price: '', rating: '', supply: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="category" label="Category" value={formData.category} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="price" label="Price" type="number" value={formData.price} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="rating" label="Rating" type="number" value={formData.rating} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="supply" label="Supply" type="number" value={formData.supply} onChange={handleChange} fullWidth margin="normal" />
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </form>
  );
};

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { data, isLoading, error } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  const handleAddProduct = () => {
    setEditProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const handleSubmit = async (formData) => {
    if (editProduct) {
      await updateProduct({ id: editProduct._id, ...formData });
      setProducts(products.map(p => p._id === editProduct._id ? { ...p, ...formData } : p));
    } else {
      const newProduct = await createProduct(formData).unwrap();
      setProducts([...products, newProduct]);
    }
    setOpenDialog(false);
  };

  const columns = [
    { field: '_id', headerName: 'ID', flex: 0.5 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 0.5 },
    { field: 'rating', headerName: 'Rating', flex: 0.5 },
    { field: 'supply', headerName: 'Supply', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleEditProduct(params.row)}>Edit</Button>
          <Button onClick={() => handleDeleteProduct(params.row._id)} color="error">Delete</Button>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    console.log("Rendering loading state");
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.log("Rendering error state", error);
    return (
      <Box m="1.5rem 2.5rem">
        <Typography variant="h4" color="error">Error loading inventory data</Typography>
        <Typography>{error.toString()}</Typography>
      </Box>
    );
  }

  const groupProductsByCategory = (products) => {
    return products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupProductsByCategory(products);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ m: "1.5rem 0 0.5rem 1.5rem" }}>Inventory</Typography>
      <Button
        onClick={handleAddProduct}
        variant="contained"
        color="primary"
        sx={{ mb: 2, ml: 2 }}
      >
        Add Product
      </Button>
      {products && products.length > 0 ? (
        Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <Accordion key={category}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>{category} ({categoryProducts.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box height="400px">
                <DataGrid
                  getRowId={(row) => row._id}
                  rows={categoryProducts}
                  columns={columns}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography sx={{ ml: 2 }}>No products found</Typography>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <ProductForm 
            product={editProduct} 
            onSubmit={handleSubmit} 
            onCancel={() => setOpenDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const WrappedInventory = () => (
  <ErrorBoundary>
    <Inventory />
  </ErrorBoundary>
);

export default WrappedInventory;
