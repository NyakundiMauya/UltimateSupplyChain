import React, { useState, useEffect } from "react";
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../state/api";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#202124',
      paper: '#202124',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e8eaed',
    },
    primary: {
      main: '#8ab4f8',
    },
    action: {
      hover: 'rgba(138, 180, 248, 0.12)',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 14,
    h4: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '0 24px 24px 0',
          marginRight: '16px',
          marginLeft: '8px',
          '&:hover': {
            backgroundColor: 'rgba(138, 180, 248, 0.12)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '40px',
        },
      },
    },
  },
});

const EmployeeManagement = () => {
  const { data: employees, error, isLoading, refetch } = useGetEmployeesQuery();
  
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    console.log("Component mounted");
    return () => console.log("Component unmounted");
  }, []);

  if (isLoading) return <CircularProgress />;
  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error" gutterBottom>
          Error fetching employees
        </Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Box>
    );
  }

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "salary", headerName: "Salary", flex: 1, type: 'number' },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row._id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = (mode, employee = {}) => {
    setDialogMode(mode);
    setCurrentEmployee(employee);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmployee({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const employeeData = {
        ...currentEmployee,
        
      };

      if (dialogMode === "add") {
        await createEmployee(employeeData).unwrap();
        setSnackbar({ open: true, message: 'Employee added successfully', severity: 'success' });
      } else {
        await updateEmployee(employeeData).unwrap();
        setSnackbar({ open: true, message: 'Employee updated successfully', severity: 'success' });
      }
      refetch();
      handleCloseDialog();
    } catch (err) {
      console.error("Error details:", JSON.stringify(err, null, 2));
      setSnackbar({ open: true, message: `Error: ${err.data?.message || 'An unexpected error occurred'}`, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id).unwrap();
        refetch();
        setSnackbar({ open: true, message: 'Employee deleted successfully', severity: 'success' });
      } catch (err) {
        console.error("Error details:", JSON.stringify(err, null, 2));
        setSnackbar({ open: true, message: `Error: ${err.data?.message || 'An unexpected error occurred'}`, severity: 'error' });
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEdit = (employee) => {
    handleOpenDialog("edit", employee);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box m="1.5rem 2.5rem" sx={{ color: 'text.primary' }}>
        <Typography variant="h1" gutterBottom sx={{ mb: 2, fontSize: '2rem', fontWeight: 'bold' }}>
          Employee Management
        </Typography>
        <Button
          onClick={() => handleOpenDialog("add")}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Add New Employee
        </Button>
        {employees && employees.length > 0 ? (
          <Box
            mt="40px"
            height="75vh"
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
                backgroundColor: 'background.default',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'background.paper',
                borderBottom: 'none',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: 'background.default',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'background.paper',
                borderTop: 'none',
              },
              '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                color: 'text.primary',
              },
            }}
          >
            <DataGrid
              loading={isLoading}
              getRowId={(row) => row._id}
              rows={employees}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              autoHeight
              pageSize={10}
            />
          </Box>
        ) : (
          <Typography variant="body1" mt="20px">
            No employees found. {employees ? `Received ${employees.length} employees.` : 'Employees data is undefined.'}
          </Typography>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{dialogMode === "add" ? "Add New Employee" : "Edit Employee"}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                value={currentEmployee.name || ""}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={currentEmployee.email || ""}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
              />
              <TextField
                margin="dense"
                name="phoneNumber"
                label="Phone Number"
                type="text"
                fullWidth
                value={currentEmployee.phoneNumber || ""}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, phoneNumber: e.target.value })}
              />
              <TextField
                margin="dense"
                name="category"
                label="Category"
                type="text"
                fullWidth
                value={currentEmployee.category || ""}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, category: e.target.value })}
              />
              <TextField
                margin="dense"
                name="salary"
                label="Salary"
                type="number"
                fullWidth
                value={currentEmployee.salary || ""}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, salary: Number(e.target.value) })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">{dialogMode === "add" ? "Add" : "Update"}</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeManagement;
