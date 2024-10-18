import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid, Snackbar } from '@mui/material';
import { setAuthDataInCache } from '../../utils/authUtils';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            tempErrors.email = "Invalid email address.";
        }
        if (!formData.password) tempErrors.password = "Password is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('/api/customers/sigin', formData);
                const authData = {
                    token: response.data.token,
                    customer: response.data.customer
                };
                
                // Store auth data in cache
                await setAuthDataInCache(authData);
                
                // Store in session storage as well (you may choose to remove this if using cache exclusively)
                sessionStorage.setItem('token', authData.token);
                sessionStorage.setItem('user', JSON.stringify(authData.customer));
                
                setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
                setTimeout(() => navigate('/pos'), 2000);
            } catch (error) {
                console.error('Login error:', error);
                let errorMessage = 'An error occurred during login. Please try again.';
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: '500px',
                margin: '0 auto',
                mt: 5,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" component="h2" gutterBottom align="center">
                Sign In
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Password"
                        variant="outlined"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            ':hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        Sign In
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => navigate('/')}
                        sx={{
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            ':hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        Back to Home
                    </Button>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Box>
    );
};

export default Login;
