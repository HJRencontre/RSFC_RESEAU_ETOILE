import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../provider/auth.provider";

export default function Dashboard() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
