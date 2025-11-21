import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/DashboardPage';
import CreateOrdemServico from './pages/CreateOrdemServico';
import EditOrdemServico from './pages/EditOrdemServico';
import ImportCsvPage from './pages/ImportCsvPage';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      {/* rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/resetar-senha" element={<ResetPasswordPage />} />

      {/* rotas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
        
        <Route 
          path="/ordens-servico/novo" 
          element={<CreateOrdemServico />} 
        />
        
        <Route
          path="/ordens-servico/editar/:id"
          element={<EditOrdemServico />}
        />
        
        <Route
          path="/importar-csv"
          element={<ImportCsvPage />}
        />

        <Route 
          path="/perfil" 
          element={<ProfilePage />}
        />
        
        </Route>
    </Routes>
  );
}

export default App;
