import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../provider/auth.provider";
import Header from "../../components/Navigation";
import { useContext } from "react";
import { UserContext } from "../../provider/user.provider";

export default function Dashboard() {
  const { token } = useAuth();
  const { user } = useContext(UserContext);

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
