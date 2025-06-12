import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated && role === "admin" ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
