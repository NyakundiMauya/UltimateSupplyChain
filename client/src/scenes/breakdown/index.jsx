import React from "react";
import { Box, useTheme, Button } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import Header from "components/Header";
import { useGetSalesQuery } from "state/api";

const Breakdown = () => {
  const { data, isLoading, refetch } = useGetSalesQuery();
  const theme = useTheme();

  if (!data || isLoading) return "Loading...";

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const formattedData = Object.entries(data.salesByCategory).map(([category, sales], index) => ({
    id: index,
    value: sales,
    label: category,
    color: colors[index % colors.length],
    labelColor: theme.palette.text.primary,
  }));

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="BREAKDOWN" subtitle="Breakdown of Sales By Category" />
      <Button onClick={() => refetch()}>Refresh Data</Button>
      <Box mt="40px" height="75vh">
        <PieChart
          series={[
            {
              data: formattedData,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30 },
            },
          ]}
          height={400}
          slotProps={{
            legend: {
              labelStyle: {
                fill: theme.palette.text.primary,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Breakdown;
