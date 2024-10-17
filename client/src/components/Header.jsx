import { Typography, Box, useTheme } from "@mui/material";
import React from "react";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h4"
        color={theme.palette.common.white}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="body1" color={theme.palette.common.white}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
