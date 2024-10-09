import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/auth');
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Hello World</h1>
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition duration-300"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;

