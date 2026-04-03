import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import ButtonSpinner from "./ButtonSpinner";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-[#5C2DD5] flex items-center justify-center p-4">
        <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 md:border-black w-full max-w-[360px] py-10 flex flex-col items-center justify-center gap-4 md:shadow-[0px_8px_0px_#000000]">
          <ButtonSpinner />
          <p className="text-white text-xl font-bold">Checking session...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
