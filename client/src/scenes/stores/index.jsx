import React, { useState } from 'react';
import { Box, Typography, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useGetStoresQuery, useCreateStoreMutation, useUpdateStoreMutation, useDeleteStoreMutation } from 'state/api';
import Header from 'components/Header';

const Stores = () => {
  const theme = useTheme();
  const { data: storesData, isLoading, error } = useGetStoresQuery();
  const [createStore] = useCreateStoreMutation();
  const [updateStore] = useUpdateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', country: '', postalCode: '', phoneNumber: '', managerName: '', managerEmail: '', status: '', branch: ''
  });

  const renderContent = () => {
    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Error loading stores: {error.message}</Typography>;
    if (!storesData || storesData.length === 0) return <Typography>No stores found.</Typography>;

    return (
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Postal Code</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Manager Name</TableCell>
              <TableCell>Manager Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Branch Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storesData.map((store) => (
              <TableRow key={store._id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.location.address}</TableCell>
                <TableCell>{store.location.city}</TableCell>
                <TableCell>{store.location.country}</TableCell>
                <TableCell>{store.location.postalCode}</TableCell>
                <TableCell>{store.phoneNumber}</TableCell>
                <TableCell>{store.manager.name}</TableCell>
                <TableCell>{store.manager.email}</TableCell>
                <TableCell>{store.status}</TableCell>
                <TableCell>{store.branch}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(store)}>Edit</Button>
                  <Button onClick={() => handleDelete(store._id)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleOpenDialog = (store = null) => {
    setCurrentStore(store);
    if (store) {
      setFormData({
        name: store.name,
        address: store.location.address,
        city: store.location.city,
        country: store.location.country,
        postalCode: store.location.postalCode,
        phoneNumber: store.phoneNumber,
        managerName: store.manager.name,
        managerEmail: store.manager.email,
        status: store.status,
        branch: store.branch
      });
    } else {
      setFormData({
        name: '', address: '', city: '', country: '', postalCode: '', phoneNumber: '', managerName: '', managerEmail: '', status: '', branch: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStore(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const storeData = {
      name: formData.name,
      location: {
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
      },
      phoneNumber: formData.phoneNumber,
      manager: {
        name: formData.managerName,
        email: formData.managerEmail,
      },
      status: formData.status,
      branch: formData.branch,
    };

    if (currentStore) {
      await updateStore({ id: currentStore._id, ...storeData });
    } else {
      await createStore(storeData);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      await deleteStore(id);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Stores" subtitle="List of all stores" />
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Add New Store
      </Button>
      {renderContent()}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" name="name" label="Name" value={formData.name} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="address" label="Address" value={formData.address} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="city" label="City" value={formData.city} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="country" label="Country" value={formData.country} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="postalCode" label="Postal Code" value={formData.postalCode} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="managerName" label="Manager Name" value={formData.managerName} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="managerEmail" label="Manager Email" value={formData.managerEmail} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="status" label="Status" value={formData.status} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" name="branch" label="Branch Code" value={formData.branch} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{currentStore ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Stores;
