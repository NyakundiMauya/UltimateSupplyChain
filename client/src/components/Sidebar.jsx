import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import { styled } from '@mui/material/styles';

const navItems = [
  { text: "Dashboard", icon: <HomeOutlined /> },
  { text: "Client Facing", icon: null },
  { text: "Products", icon: <ShoppingCartOutlined /> },
  { text: "Customers", icon: <Groups2Outlined /> },
  { text: "Transactions", icon: <ReceiptLongOutlined /> },
  { text: "Sales", icon: null },
  { text: "Overview", icon: <TrendingUpOutlined /> },
  { text: "Daily", icon: <TodayOutlined /> },
  { text: "Monthly", icon: <CalendarMonthOutlined /> },
  { text: "Breakdown", icon: <PieChartOutlined /> },
  { text: "Finance", icon: null },
  { text: "Expenses", icon: <PointOfSaleOutlined /> },  
  { text: "Invoices", icon: <ReceiptLongOutlined /> },
  { text: "Management", icon: null },
  { text: "Employees", icon: <Groups2Outlined /> },
  { text: "Inventory", icon: <ShoppingCartOutlined /> }, // New item
  { text: "Assets", icon: <PublicOutlined /> }, // New item 
  { text: "Settings", icon: <SettingsOutlined /> },
];

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: '0 24px 24px 0',
  marginRight: '16px',
  marginLeft: '8px',
  '&:hover': {
    backgroundColor: 'transparent', // Remove hover background color
  },
}));

const Sidebar = ({ user, drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleNavigation = (text, path) => {
    navigate(path || `/${text.toLowerCase()}`);
    setActive(path ? path.substring(1) : text.toLowerCase());
  };

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            height: '100vh',
            '& .MuiDrawer-paper': {
              color: '#ffffff',
              backgroundColor: '#202124', // Dark grey background
              boxSizing: 'border-box',
              borderWidth: 0,
              width: drawerWidth,
              height: '100%',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            },
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            height="100%"
          >
            <Box m="1.5rem 1rem 1rem 1rem">
              <FlexBetween>
                <Typography variant="subtitle1" fontWeight="700" color="#8ab4f8">
                  USC
                </Typography>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} sx={{ color: '#ffffff' }}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            <List sx={{ flexGrow: 1, pt: 0 }}>
              {navItems.map(({ text, icon, path }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "1.5rem 0 0.5rem 1.5rem", color: '#9aa0a6', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>
                      {text}
                    </Typography>
                  );
                }

                const lcText = path ? path.substring(1) : text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
                    <StyledListItemButton
                      onClick={() => handleNavigation(text, path)}
                      sx={{
                        backgroundColor: active === lcText ? 'rgba(138, 180, 248, 0.12)' : 'transparent',
                        color: active === lcText ? '#8ab4f8' : '#e8eaed',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: '40px',
                          color: active === lcText ? '#8ab4f8' : '#9aa0a6',
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={text} 
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem', 
                          fontWeight: active === lcText ? 500 : 400 
                        }} 
                      />
                    </StyledListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
