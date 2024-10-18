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
} from "@mui/material";
import {
  useGetAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import './index.css'; // Import the CSS file

const Assets = () => {
  const theme = useTheme();
  const { data, isLoading, refetch } = useGetAssetsQuery();
  const [addAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Define columns for DataGrid
  const columns = [
    { field: "_id", headerName: "ID", flex: 1, minWidth: 200 },
    { field: "type", headerName: "Type", flex: 0.5, minWidth: 100 },
    { field: "title", headerName: "Title", flex: 1, minWidth: 150 },
    { field: "serialNumber", headerName: "Serial Number", flex: 1, minWidth: 150 },
    { field: "departmentLoanedTo", headerName: "Department Loaned To", flex: 1, minWidth: 150 },
    {
      field: "dateLoaned",
      headerName: "Date Loaned",
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      field: "dateReturned",
      headerName: "Date Returned",
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button 
            onClick={() => handleOpenDialog(params.row)}
            className="edit-button"
            size="small"
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDeleteAsset(params.row._id)} 
            color="error"
            className="delete-button"
            size="small"
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = (asset = null) => {
    setCurrentAsset(asset);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentAsset(null);
    setOpenDialog(false);
  };

  const handleSaveAsset = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const assetData = Object.fromEntries(formData.entries());

    try {
      if (currentAsset) {
        await updateAsset({ id: currentAsset._id, ...assetData }).unwrap();
        setSnackbar({ open: true, message: 'Asset updated successfully', severity: 'success' });
      } else {
        await addAsset(assetData).unwrap();
        setSnackbar({ open: true, message: 'Asset added successfully', severity: 'success' });
      }
      refetch();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save asset:", error);
      setSnackbar({ 
        open: true, 
        message: `Failed to save asset: ${error.data?.message || error.message || 'Unknown error'}`, 
        severity: 'error' 
      });
    }
  };

  const handleDeleteAsset = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await deleteAsset(id).unwrap();
        refetch();
        setSnackbar({ open: true, message: 'Asset deleted successfully', severity: 'success' });
      } catch (error) {
        console.error("Failed to delete asset:", error);
        setSnackbar({ 
          open: true, 
          message: `Failed to delete asset: ${error.data?.message || error.message || 'Unknown error'}`, 
          severity: 'error' 
        });
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="dashboard-container assets-container">
      <Box className="dashboard-header">
        <Header title="Assets" subtitle="List of Assets" />
        <Button
          onClick={() => handleOpenDialog()}
          variant="contained"
          color="primary"
          className="add-asset-button"
        >
          Add Asset
        </Button>
      </Box>
      <Box 
        className="dashboard-grid data-grid-container"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          '& .MuiDataGrid-root': {
            width: '90%',
            maxWidth: '1200px',
          }
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
          className="assets-data-grid"
          autoHeight
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          className: "dialog-paper",
          style: {
            backgroundColor: theme.palette.background.alt,
          }
        }}
      >
        <DialogTitle className="dialog-title">
          {currentAsset ? "Edit Asset" : "Add Asset"}
        </DialogTitle>
        <form onSubmit={handleSaveAsset}>
          <DialogContent>
            <TextField
              name="type"
              label="Type"
              defaultValue={currentAsset?.type || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="title"
              label="Title"
              defaultValue={currentAsset?.title || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="serialNumber"
              label="Serial Number"
              defaultValue={currentAsset?.serialNumber || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="departmentLoanedTo"
              label="Department Loaned To"
              defaultValue={currentAsset?.departmentLoanedTo || ""}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="dateLoaned"
              label="Date Loaned"
              type="date"
              defaultValue={currentAsset?.dateLoaned ? new Date(currentAsset.dateLoaned).toISOString().split('T')[0] : ""}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="dateReturned"
              label="Date Returned"
              type="date"
              defaultValue={currentAsset?.dateReturned ? new Date(currentAsset.dateReturned).toISOString().split('T')[0] : ""}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
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

export default Assets;
