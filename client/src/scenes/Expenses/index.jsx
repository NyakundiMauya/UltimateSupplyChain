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
  InputAdornment,
} from "@mui/material";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import './index.css'; // Import the CSS file

const Expenses = () => {
  const theme = useTheme();
  const { data, isLoading, refetch } = useGetExpensesQuery();
  const [addExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Define columns for DataGrid
  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { 
      field: "amount", 
      headerName: "Amount (KSH)", 
      flex: 0.5, 
      type: 'number',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        return `KSH ${params.value.toLocaleString()}`;
      },
    },
    { field: "type", headerName: "Type", flex: 0.5 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    { field: "status", headerName: "Status", flex: 0.5 },
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
            onClick={() => handleDeleteExpense(params.row._id)} 
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

  // Open dialog with current expense data or empty form for new expense
  const handleOpenDialog = (expense = null) => {
    setCurrentExpense(expense);
    setOpenDialog(true);
  };

  // Close dialog and reset form state
  const handleCloseDialog = () => {
    setCurrentExpense(null);
    setOpenDialog(false);
  };

  // Handle adding or updating an expense
  const handleSaveExpense = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const expenseData = Object.fromEntries(formData.entries());

    try {
      if (currentExpense) {
        await updateExpense({ id: currentExpense._id, ...expenseData }).unwrap();
        setSnackbar({ open: true, message: 'Expense updated successfully', severity: 'success' });
      } else {
        await addExpense(expenseData).unwrap();
        setSnackbar({ open: true, message: 'Expense added successfully', severity: 'success' });
      }
      refetch();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save expense:", error);
      setSnackbar({ 
        open: true, 
        message: `Failed to save expense: ${error.data?.message || error.message || 'Unknown error'}`, 
        severity: 'error' 
      });
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id).unwrap();
        refetch();
        setSnackbar({ open: true, message: 'Expense deleted successfully', severity: 'success' });
      } catch (error) {
        console.error("Failed to delete expense:", error);
        setSnackbar({ 
          open: true, 
          message: `Failed to delete expense: ${error.data?.message || error.message || 'Unknown error'}`, 
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
    <Box className="expenses-container">
      <Header title="Expenses" subtitle="List of Expenses" />
      <Button
        onClick={() => handleOpenDialog()}
        variant="contained"
        color="primary"
        className="add-expense-button"
      >
        Add Expense
      </Button>
      <Box className="data-grid-container">
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          className: "dialog-paper",
        }}
      >
        <DialogTitle className="dialog-title">
          {currentExpense ? "Edit Expense" : "Add Expense"}
        </DialogTitle>
        <form onSubmit={handleSaveExpense}>
          <DialogContent>
            <TextField
              name="title"
              label="Title"
              defaultValue={currentExpense?.title || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="amount"
              label="Amount (KSH)"
              type="number"
              defaultValue={currentExpense?.amount || ""}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">KSH</InputAdornment>,
              }}
            />
            <TextField
              name="type"
              label="Type"
              defaultValue={currentExpense?.type || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              defaultValue={currentExpense?.date ? new Date(currentExpense.date).toISOString().split('T')[0] : ""}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              name="status"
              label="Status"
              defaultValue={currentExpense?.status || "pending"}
              fullWidth
              margin="normal"
              required
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

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Expenses;
