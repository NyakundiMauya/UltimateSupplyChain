import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Grid, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        country: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required.";
        if (!formData.email) tempErrors.email = "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            tempErrors.email = "Invalid email address.";
        }
        if (!formData.phoneNumber) tempErrors.phoneNumber = "Phone number is required.";
        if (!formData.country) tempErrors.country = "Country is required.";
        if (!formData.password) tempErrors.password = "Password is required.";
        if (formData.password.length < 8) {
            tempErrors.password = "Password must be at least 8 characters long.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('/api/customers/signup', formData);
                setSnackbar({ open: true, message: 'Signup successful!', severity: 'success' });
                setTimeout(() => navigate('/signin'), 2000);
            } catch (error) {
                console.error('Signup error:', error);
                let errorMessage = 'An error occurred during signup. Please try again.';
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
                Create Account
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Grid>
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
                        label="Phone Number"
                        variant="outlined"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Country"
                        variant="outlined"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.country}
                        helperText={errors.country}
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
                        Sign Up
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

export default Signup;
