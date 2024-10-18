import React, { useState, useEffect } from 'react';
import { getAuthDataFromCache, isAuthenticated } from '../../utils/authUtils';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Container,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

const Settings = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          const authData = await getAuthDataFromCache();
          if (authData && authData.employee) {
            setEmployeeData(authData.employee);
          } else {
            setError('Unable to retrieve employee information. Please try logging in again.');
          }
        } else {
          setError('Please log in to view settings.');
        }
      } catch (err) {
        console.error('Error in Settings:', err);
        setError('An error occurred while fetching employee information.');
      }
    };

    fetchEmployeeData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Profile
      </Typography>
      {error && (
        <Typography color="error" align="center">{error}</Typography>
      )}
      {employeeData ? (
        <StyledCard>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <StyledAvatar>{employeeData.name.charAt(0)}</StyledAvatar>
              <Typography variant="h5" component="h2" gutterBottom align="center">
                {employeeData.name}
              </Typography>
            </Box>
            <List>
              <ProfileItem label="Email" value={employeeData.email} />
              <ProfileItem label="Phone Number" value={employeeData.phoneNumber || 'Not specified'} />
              <ProfileItem label="Role" value={employeeData.role || 'Not specified'} />
              <ProfileItem label="Category" value={employeeData.category || 'Not specified'} />
            </List>
          </CardContent>
        </StyledCard>
      ) : (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

const ProfileItem = ({ label, value }) => (
  <ListItem>
    <ListItemText primary={label} secondary={value} />
  </ListItem>
);

export default Settings;
