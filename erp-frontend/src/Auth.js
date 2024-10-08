import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/signup';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.token); // Store the token in localStorage
                    setMessage('Login successful!');
                    navigate('/dashboard'); // Redirect to Dashboard
                } else {
                    setMessage('Signup successful! You can now log in.');
                }
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            console.error('Error during authentication:', error);
        }
    };

    return (
        <div className="Auth">
            <h1>{isLogin ? 'Login' : 'Signup'}</h1>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
            </form>
            <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Signup' : 'Login'}
                </button>
            </p>
            {message && <p>{message}</p>} {/* Display success/error messages */}
        </div>
    );
};

export default Auth;

