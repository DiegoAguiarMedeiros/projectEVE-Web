import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "src/hooks/queries/user/useUser";
import { Box, CircularProgress } from "@mui/material";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, error } = useUser();
  const location = useLocation();
  
  if (isLoading || isLoading === null) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Navigate to="/entrar" replace />;
  }

  if (user && !user.isRegistrationComplete && location.pathname !== "/completar-cadastro") {
    return <Navigate to="/completar-cadastro" replace />;
  }

  return <>{children}</>;
};
