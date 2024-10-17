import React, { useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { LineChart } from "@mui/x-charts/LineChart";
import { useGetSalesQuery } from "state/api";

const Monthly = () => {
  const { data } = useGetSalesQuery();
  const theme = useTheme();

  const formattedData = useMemo(() => {
    if (!data) return { months: [], totalSales: [], totalUnits: [] };

    const { monthlyData } = data;
    const months = [];
    const totalSales = [];
    const totalUnits = [];

    Object.values(monthlyData).forEach(({ month, totalSales: sales, totalUnits: units }) => {
      months.push(month);
      totalSales.push(sales);
      totalUnits.push(units);
    });

    return { months, totalSales, totalUnits };
  }, [data]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />
      <Box height="75vh">
        {data ? (
          <LineChart
            xAxis={[{ scaleType: 'point', data: formattedData.months }]}
            series={[
              {
                data: formattedData.totalSales,
                label: 'Total Sales',
                color: theme.palette.secondary.main,
              },
              {
                data: formattedData.totalUnits,
                label: 'Total Units',
                color: theme.palette.secondary[600],
              },
            ]}
            width={800}
            height={600}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Monthly;
