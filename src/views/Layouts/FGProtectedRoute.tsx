// TODO: we should move this to not be a client side check...
import { useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

export default function FGLayout() {
  const { position } = useContext(AuthenticationContext);

  if (position !== "FG") return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
