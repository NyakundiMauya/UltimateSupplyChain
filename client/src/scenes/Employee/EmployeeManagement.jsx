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
  InputAdornment,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
    { 
      field: "salary", 
      headerName: "Salary (KSh)", 
      flex: 1, 
      type: 'number',
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }
        return `KSh ${params.value.toLocaleString()}`;
      },
    },
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
      <Box className="employee-management">
        <Typography variant="h1" gutterBottom>
          Employee Management
        </Typography>
        <Button
          onClick={() => handleOpenDialog("add")}
          variant="contained"
          color="primary"
          className="add-button"
        >
          Add New Employee
        </Button>
        {employees && employees.length > 0 ? (
          <Box className="employee-grid">
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
                label="Salary (KSh)"
                type="number"
                fullWidth
                value={currentEmployee.salary || ""}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, salary: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">KSh</InputAdornment>,
                }}
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
