import { Navigate } from "react-router";
import { useAuthQuery } from "../services/auth";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuthQuery();

  if (isLoading) return "Loading...";

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
