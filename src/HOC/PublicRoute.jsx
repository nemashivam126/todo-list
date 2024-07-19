import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const PublicRoute = ({ children }) => {
    const [cookies] = useCookies(['username', 'user-id']);
    const token = localStorage.getItem('token');
    const isAuthenticated = token && cookies['username'] && cookies['user-id'];

    return !isAuthenticated ? (
        children
    ) : (
        <Navigate to="/todos" />
    );
};

export default PublicRoute;
