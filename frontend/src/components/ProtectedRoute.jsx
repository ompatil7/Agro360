import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ role, children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading)
    {
        return <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-mycol-mint border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-mycol-sea_green">Loading...</p>
        </div>;
    }

    if (!user)
    {
        // User is not authenticated
        return <Navigate to="/signin" />;
    }

    if (role && user.role !== role)
    {
        // User does not have the required role
        return <Navigate to="/" />;
    }

    // User is authenticated and has the required role
    return children;
};

export default ProtectedRoute;