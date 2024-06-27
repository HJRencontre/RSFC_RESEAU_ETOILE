import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../provider/auth.provider";
import Header from "../../components/Navigation";
import PartnersTable from "../../components/Backoffice/partnersTable";
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
      <PartnersTable/>
      <Outlet/>
    </>
  );
}
