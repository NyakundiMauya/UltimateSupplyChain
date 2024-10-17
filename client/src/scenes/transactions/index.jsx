import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
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
  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
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
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

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
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: "#202124",
            color: "#ffffff",
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "0.875rem",
            fontWeight: 400,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(138, 180, 248, 0.12)",
            color: "#8ab4f8",
            borderBottom: "none",
            fontSize: "0.75rem",
            fontWeight: 500,
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#202124",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "rgba(138, 180, 248, 0.12)",
            color: "#8ab4f8",
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "#8ab4f8 !important",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
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
