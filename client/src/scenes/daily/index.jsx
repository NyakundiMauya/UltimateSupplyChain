import React, { useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { LineChart } from "@mui/x-charts/LineChart";
import { useGetSalesQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));
  const { data } = useGetSalesQuery();
  const theme = useTheme();

  const formattedData = useMemo(() => {
    if (!data) return { dates: [], totalSales: [], totalUnits: [] };

    const { dailyData } = data;
    const dates = [];
    const totalSales = [];
    const totalUnits = [];

    Object.values(dailyData).forEach(({ date, totalSales: sales, totalUnits: units }) => {
      const dateFormatted = new Date(date);
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        const splitDate = date.substring(date.indexOf("-") + 1);
        dates.push(splitDate);
        totalSales.push(sales);
        totalUnits.push(units);
      }
    });

    return { dates, totalSales, totalUnits };
  }, [data, startDate, endDate]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY SALES" subtitle="Chart of daily sales" />
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
        </Box>

        {data ? (
          <LineChart
            xAxis={[{ scaleType: 'point', data: formattedData.dates }]}
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

export default Daily;
