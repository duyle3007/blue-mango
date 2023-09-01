import React, { Suspense, lazy } from "react";
import { Navigate, useRoutes, useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
import LoadingScreen from "../components/LoadingScreen";

const Loadable = (Component: React.FC) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes("/dashboard")} />}>
      <Component {...props} />
    </Suspense>
  );
};

const ActivityOverview = Loadable(lazy(() => import("../pages/ActivityOverview")));
const ActivityDetail = Loadable(lazy(() => import("../pages/ActivityDetail")));
const ManageAccount = Loadable(lazy(() => import("../pages/ManageAccount")));
const NotFound = Loadable(lazy(() => import("../pages/Page404")));

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Navigate to="/dashboard/activity-overview" replace />
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          element: <Navigate to="/dashboard/activity-overview" replace />,
          index: true
        },
        {
          path: "activity-overview",
          element: <ActivityOverview />
        },
        {
          path: "activity-overview/:userId",
          element: <ActivityDetail />
        },
        {
          path: "manage-accounts",
          element: <ManageAccount />
        }
      ]
    },
    {
      path: "*",
      element: <LogoOnlyLayout />,
      children: [
        { path: "404", element: <NotFound /> },
        {
          path: "*",
          element: <Navigate to="/404" replace />
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />
    }
  ]);
}
