// TODO: we should move this to not be a client side check...
import { useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

export default function ProtectedLayout() {
  const { isAuthenticated } = useContext(AuthenticationContext);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
