import React, { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/authService'; // Importa o AuthService para validar o usuário

interface PrivateRouteProps {
  redirectTo?: string;
}

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  console.log('PrivateRoute Renderizado');
  const isAuthenticated = AuthService.checkAuthSync();

  if (!isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando...');
    return <Navigate to="/login" replace />;
  }

  console.log('Usuário autenticado, renderizando filhos...');
  return <>{children}</>;
};
