import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/auth');  // Navigate to the auth page
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-white dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-300 mb-6">
                Welcome to the App
            </h1>
            <button 
                onClick={handleClick} 
                className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md transition duration-300"
            >
                Go to Login/Signup
            </button>
        </div>
    );
};

export default Home;

