import React from 'react';
import { useGetExpensesQuery } from '../../state/api';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import './index.css';

const Invoices = () => {
  const { data: expenses, isLoading, isError } = useGetExpensesQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography color="error">Error loading expenses</Typography>;
  }

  const pendingExpenses = expenses.filter(expense => expense.status === 'pending');

  return (
    <Box className="invoices-container">
      <Typography variant="h4" className="invoices-title">Pending Expenses</Typography>
      <TableContainer component={Paper}>
        <Table className="invoices-table" aria-label="pending expenses table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingExpenses.map((expense) => (
              <TableRow
                key={expense._id}
                className="invoices-table-row"
              >
                <TableCell component="th" scope="row">
                  {expense.title}
                </TableCell>
                <TableCell align="right">KSH {expense.amount.toFixed(2)}</TableCell>
                <TableCell align="right">{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Invoices;
