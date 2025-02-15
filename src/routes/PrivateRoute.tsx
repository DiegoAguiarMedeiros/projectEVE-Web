import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService'; // Importe o AuthService corretamente

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authStatus = await AuthService.checkAuth();
      setIsAuthenticated(authStatus);
    };
    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    // Exibe um carregando ou placeholder enquanto verifica a autenticação
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/entrar' replace />;
  }

  return <>{children}</>;
};
