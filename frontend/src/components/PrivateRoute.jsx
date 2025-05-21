import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    if (user.role === 'guest') {
        return <Navigate to="/" />;
    }

    return allowedRoles.includes(user.role) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
