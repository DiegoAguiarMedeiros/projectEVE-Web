import { Navigate } from 'react-router-dom';
import { useUser } from 'src/hooks/queries/user/useUser';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, error } = useUser();

  if (isLoading === null) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <Navigate to='/entrar' replace />;
  }

  return <>{children}</>;
};
