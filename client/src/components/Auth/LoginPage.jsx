// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContainer, AuthForm, AuthInput, AuthButton, AuthError } from './authStyles';

// Add this line at the top of your file
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9000';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/employees/login`, {
                email,
                password,
            });
            const { token, employee } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('employee', JSON.stringify(employee));
            // Remove the alert and use a more user-friendly notification method if needed
            navigate('/dashboard');
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Invalid email or password. Please try again.');
                } else if (err.response.status === 404) {
                    setError('Login service is not available. Please contact the administrator.');
                } else {
                    setError(err.response.data.error || 'Login failed');
                }
            } else if (err.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <AuthContainer>
            <h2>Login</h2>
            {error && <AuthError>{error}</AuthError>}
            <AuthForm onSubmit={handleLogin}>
                <AuthInput
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <AuthInput
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <AuthButton type="submit" variant="contained">Login</AuthButton>
            </AuthForm>
        </AuthContainer>
    );
};

export default Login;
