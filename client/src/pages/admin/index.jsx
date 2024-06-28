import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../provider/auth.provider";
import Header from "../../components/Navigation";
import Partners from "../../components/Common/Partners";
import Events from "../../components/Common/Events";
import Invite from "../../components/Common/Invite";

export default function AdminDashboard() {
  const {token} = useAuth();

  if (!token) {
    return <Navigate to="/login"/>;
  }

  return (
    <>
      <Header/>
      <Invite/>
      <Events/>
      <Partners/>
      <Outlet/>
    </>
  );
}
