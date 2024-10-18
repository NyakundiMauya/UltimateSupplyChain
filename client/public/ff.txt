import React, { useState } from "react";
import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";

const Customers = () => {
  const theme = useTheme();
  const { data, isLoading, refetch } = useGetCustomersQuery();
  const [addCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Define columns for DataGrid
  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        const value = params.value || "";
        return value.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
      },
    },
    { field: "country", headerName: "Country", flex: 0.4 },
    { field: "role", headerName: "Role", flex: 0.5 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      renderCell: (params) => (
        <Box>
          <Button 
            onClick={() => handleOpenDialog(params.row)}
            sx={{
              color: theme.palette.secondary[100],
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDeleteCustomer(params.row._id)} 
            color="error"
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Open dialog with current customer data or empty form for new customer
  const handleOpenDialog = (customer = null) => {
    setCurrentCustomer(customer);
    setOpenDialog(true);
  };

  // Close dialog and reset form state
  const handleCloseDialog = () => {
    setCurrentCustomer(null);
    setOpenDialog(false);
  };

  // Handle adding or updating a customer
  const handleSaveCustomer = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    try {
      if (currentCustomer) {
        await updateCustomer({ id: currentCustomer._id, ...customerData }).unwrap();
        setSnackbar({ open: true, message: 'Customer updated successfully', severity: 'success' });
      } else {
        await addCustomer(customerData).unwrap();
        setSnackbar({ open: true, message: 'Customer added successfully', severity: 'success' });
      }
      refetch();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save customer:", error);
      setSnackbar({ 
        open: true, 
        message: `Failed to save customer: ${error.data?.message || error.message || 'Unknown error'}`, 
        severity: 'error' 
      });
    }
  };

  // Handle deleting a customer
  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await deleteCustomer(id).unwrap();
        console.log("Delete response:", response);
        refetch();
        setSnackbar({ open: true, message: 'Customer deleted successfully', severity: 'success' });
      } catch (error) {
        console.error("Failed to delete customer:", error);
        
        let errorMessage = 'Unknown error occurred';
        if (error.status === 'PARSING_ERROR') {
          errorMessage = `Server returned an invalid response. Status: ${error.originalStatus}`;
          if (error.data) {
            errorMessage += `. Message: ${error.data}`;
          }
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setSnackbar({ 
          open: true, 
          message: `Failed to delete customer: ${errorMessage}`, 
          severity: 'error' 
        });
      }
    }
  };

  // Function to handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Customers" subtitle="List of Customers" />
      <Button
        onClick={() => handleOpenDialog()}
        variant="contained"
        color="primary"
        sx={{ 
          mb: 2,
          fontSize: "14px",
          fontWeight: "bold",
          padding: "10px 20px",
        }}
      >
        Add Customer
      </Button>
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: theme.palette.background.default,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
          "& .MuiDataGrid-row:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
      </Box>

      {/* Dialog for adding or editing customer */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.alt,
            borderRadius: "12px",
          }
        }}
      >
        <DialogTitle sx={{ color: theme.palette.secondary[100] }}>
          {currentCustomer ? "Edit Customer" : "Add Customer"}
        </DialogTitle>
        <form onSubmit={handleSaveCustomer}>
          <DialogContent>
            <TextField
              name="name"
              label="Name"
              defaultValue={currentCustomer?.name || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="email"
              label="Email"
              defaultValue={currentCustomer?.email || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              defaultValue={currentCustomer?.phoneNumber || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="country"
              label="Country"
              defaultValue={currentCustomer?.country || ""}
              fullWidth
              margin="normal"
            />
            <TextField
              name="role"
              label="Role"
              defaultValue={currentCustomer?.role || ""}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add this Snackbar component at the end of your JSX */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;
