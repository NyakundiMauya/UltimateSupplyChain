// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContainer, AuthForm, AuthInput, AuthButton, AuthError, ButtonContainer } from './authStyles';
import { Toast } from '../common/Toast';

// Add this line at the top of your file
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9000';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showCookieToast, setShowCookieToast] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            setShowCookieToast(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setShowCookieToast(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/employees/login`, {
                email,
                password,
            });
            const { token, employee } = response.data;
            
            // Store auth data in cache instead of localStorage
            if ('caches' in window) {
                const cache = await caches.open('auth-cache');
                await cache.put('auth-data', new Response(JSON.stringify({ token, employee })));
            }

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

    const handleHomeClick = () => {
        navigate('/home');
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
                <ButtonContainer>
                    <AuthButton type="submit" variant="contained">Login</AuthButton>
                    <AuthButton onClick={handleHomeClick} variant="outlined">Home</AuthButton>
                </ButtonContainer>
            </AuthForm>
            {showCookieToast && (
                <Toast 
                    message="This site uses cookies. Do you accept?"
                    onAccept={handleAcceptCookies}
                    onDecline={() => setShowCookieToast(false)}
                />
            )}
        </AuthContainer>
    );
};

export default Login;
