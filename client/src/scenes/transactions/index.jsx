import React, { useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";

const Transactions = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const { data: transactionsData, isLoading, error } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => `KSH ${Number(params.value).toFixed(2)}`,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "paymentDetails",
      headerName: "Payment Details",
      flex: 1,
      renderCell: (params) => {
        if (params.row.paymentMethod === 'card') {
          return `${params.value.cardBrand} **** ${params.value.lastFourDigits}`;
        } else if (params.row.paymentMethod === 'mpesa') {
          return `M-Pesa: ${params.row.mpesaDetails.phoneNumber}`;
        }
        return 'N/A';
      },
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  if (error) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header 
          title="Transactions" 
          subtitle="Error loading transactions" 
          titleVariant="h5" 
          subtitleVariant="subtitle2" 
        />
        <Typography color="error" variant="h6" mt={2}>
          {error.status === 'FETCH_ERROR' 
            ? 'Network error. Please check your connection and try again.' 
            : error.status === 'PARSING_ERROR'
            ? 'Error parsing the server response. Please try again later.'
            : error.status === 'CUSTOM_ERROR'
            ? `Server error: ${error.error}`
            : `An unexpected error occurred. Please try again later. (Status: ${error.status || 'unknown'})`}
        </Typography>
        {process.env.NODE_ENV === 'development' && (
          <Typography color="error" variant="body2" mt={1}>
            Debug info: {JSON.stringify(error, null, 2)}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header 
        title="Transactions" 
        subtitle="List of transactions" 
        titleVariant="h5" 
        subtitleVariant="subtitle2" 
      />
      <Box
        height="80vh"
        mt="20px" // Add top margin for spacing
      >
        <DataGrid
          loading={isLoading || !transactionsData}
          getRowId={(row) => row._id}
          rows={transactionsData || []}
          columns={columns}
          rowCount={(transactionsData && transactionsData.length) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
          sx={{
            "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
              borderRight: "1px solid rgba(224, 224, 224, 0.1)",
            },
            "& .MuiDataGrid-columnsContainer, & .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(224, 224, 224, 0.1)",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
