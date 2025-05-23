import { Navigate } from "react-router";
import { Navigation } from "../components";
import { useAuthQuery } from "../services/auth";
import { Loader } from "./loader";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuthQuery();

  if (isLoading) return <Loader size="lg" fullScreen />;

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-6xl mt-4 px-4 mx-auto">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
