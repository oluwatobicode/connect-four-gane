import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
