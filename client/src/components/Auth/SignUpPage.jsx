// src/pages/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContainer, AuthForm, AuthInput, AuthButton, AuthError, ButtonContainer } from './authStyles';
import { MenuItem } from '@mui/material';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        category: '',
        branch: '',
        position: '',
        salary: '', // New field
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const validateBranchCode = (branch) => {
        const branchRegex = /^[A-Z]{3}\d{3}$/;
        return branchRegex.test(branch);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validatePhoneNumber(formData.phoneNumber)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        if (!validateBranchCode(formData.branch)) {
            setError('Please enter a valid branch code (e.g., NBO001).');
            return;
        }
        try {
            const dataToSend = {
                ...formData,
                salary: Number(formData.salary), // Convert to number
            };
            const response = await axios.post('http://localhost:9000/api/employees/signup', dataToSend);
            alert('Signup successful! Please login.');
            navigate('/login');
        } catch (err) {
            // Set error message if signup fails
            if (err.response) {
                setError(err.response.data.error || 'Signup failed');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <AuthContainer>
            <h2>Signup</h2>
            {error && <AuthError>{error}</AuthError>}
            <AuthForm onSubmit={handleSignup}>
                <AuthInput
                    name="name"
                    label="Name"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <AuthInput
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <AuthInput
                    name="phoneNumber"
                    label="Phone Number (10 digits)"
                    variant="outlined"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                <AuthInput
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <AuthInput
                    name="category"
                    label="Category"
                    variant="outlined"
                    select
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="">Select a category</MenuItem>
                    <MenuItem value="Human Resources (HR)">Human Resources (HR)</MenuItem>
                    <MenuItem value="Finance and Accounting">Finance and Accounting</MenuItem>
                    <MenuItem value="Sales and Marketing">Sales and Marketing</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                    <MenuItem value="Information Technology (IT)">Information Technology (IT)</MenuItem>
                </AuthInput>
                <AuthInput
                    name="branch"
                    label="Branch Code (e.g., NBO001)"
                    variant="outlined"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                />
                <AuthInput
                    name="position"
                    label="Position"
                    variant="outlined"
                    value={formData.position}
                    onChange={handleChange}
                    required
                />
                
                <ButtonContainer>
                    <AuthButton type="submit" variant="contained">Signup</AuthButton>
                    <AuthButton type="button" variant="outlined" onClick={navigateToLogin}>Login</AuthButton>
                </ButtonContainer>
            </AuthForm>
        </AuthContainer>
    );
};

export default SignUpPage;
