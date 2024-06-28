import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../provider/auth.provider";
import Header from "../../components/Navigation";
import Partners from "../../components/Common/Partners";
import Events from "../../components/Common/Events";

export default function AdminDashboard() {
  const {token} = useAuth();

  if (!token) {
    return <Navigate to="/login"/>;
  }

  return (
    <>
      <Header/>
      <Events/>
      <Partners/>
      <Outlet/>
    </>
  );
}
