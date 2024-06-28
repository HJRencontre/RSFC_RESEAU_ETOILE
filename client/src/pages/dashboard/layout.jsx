import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../provider/auth.provider";
import Header from "../../components/Navigation";

export default function Dashboard() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
