import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {useAuth} from "./provider/auth.provider";

import Login from "./pages/authentication/login";

import Dashboard from "./pages/dashboard/layout";
import Home from "./pages/dashboard/home/index";
import Offer from "./pages/dashboard/offer/index";

import TermsOfUse from "./pages/legal/terms-of-use";
import LegalNotice from "./pages/legal/legal-notice";
import PrivacyPolicy from "./pages/legal/privacy-policy";
import NotFound from "./pages/404";
import AdminDashboard from "./pages/admin";

const Routes = () => {
  const {token} = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/conditions-générales-utilisation",
      element: <TermsOfUse/>,
    },
    {
      path: "/mentions-légales",
      element: <LegalNotice/>,
    },
    {
      path: "/politique-de-confidentialité",
      element: <PrivacyPolicy/>,
    },
    {
      path: "*",
      element: <NotFound/>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/offer/:id",
          element: <Offer />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login/>,
    }
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router}/>;
};

export default Routes;
