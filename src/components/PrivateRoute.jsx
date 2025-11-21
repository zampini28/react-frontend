import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { authToken, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
