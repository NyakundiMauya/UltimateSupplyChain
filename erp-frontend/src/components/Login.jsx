import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    
    const [error, setError] = useState(null); // Keep a single declaration for error
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages

        console.log('Submitting login form with values:', values); // Log the values being submitted

        try {
            const result = await axios.post('http://localhost:3000/auth/adminlogin', values);
            console.log('Response from server:', result); // Log the full response from the server

            // Check the login status
            if (result.data.loginStatus) {
                setSuccess('Login successful!');
                console.log('Login successful!'); // Log success message
                navigate('/dashboard'); // Navigate to the dashboard after successful login
            } else {
                setError(result.data.Error || 'Login failed. Please try again.'); // Set error message
                console.log('Login failed with message:', result.data.Error); // Log error message from response
            }
        } catch (err) {
            console.error('An error occurred during the login process:', err); // Log the error object
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                {error && <div className='alert alert-danger'>{error}</div>} {/* Display error if present */}
                {success && <div className='alert alert-success'>{success}</div>} {/* Display success if present */}
                <h2>Login Page</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input
                            type="email"
                            name='email'
                            autoComplete='off'
                            placeholder='Enter Email'
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input
                            type="password"
                            name='password'
                            placeholder='Enter Password'
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Login</button>
                    <div className='mb-1'>
                        <input type="checkbox" name='tick' id='tick' className="me-2" />
                        <label htmlFor="tick"><strong>You agree with terms & conditions</strong></label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
