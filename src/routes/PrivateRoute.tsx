import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "src/hooks/queries/user/useUser";
import { usePaths } from "src/hooks/usePaths";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, error } = useUser();
  const location = useLocation();
  const paths = usePaths();

  if (isLoading || isLoading === null) {
    return null;
  }

  if (error) {
    return <Navigate to={paths.signIn} replace />;
  }

  if (user && !user.isRegistrationComplete && location.pathname !== paths.completeRegistration) {
    return <Navigate to={paths.completeRegistration} replace />;
  }

  return <>{children}</>;
};
