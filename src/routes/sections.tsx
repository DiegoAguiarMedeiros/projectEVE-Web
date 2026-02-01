import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import Box from "@mui/material/Box";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";

import { varAlpha } from "src/theme/styles";
import { AuthLayout } from "src/layouts/auth";
import { SimpleLayout } from "src/layouts/simple";
import { DashboardLayout } from "src/layouts/dashboard";
import { NavlessLayout } from "src/layouts/navless";
import { PrivateRoute } from "./PrivateRoute";

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import("src/pages/home"));
export const BlogPage = lazy(() => import("src/pages/blog"));
export const EnvelopePage = lazy(() => import("src/pages/envelope"));
export const SignInPage = lazy(() => import("src/pages/sign-in"));
export const IncomesPage = lazy(() => import("src/pages/incomes"));
export const SettingsPage = lazy(() => import("src/pages/settings"));
export const ProfilePage = lazy(() => import("src/pages/profile"));
export const CompleteRegistration = lazy(() => import("src/pages/completeRegistration"));
export const Registration = lazy(() => import("src/pages/registration"));
export const ReallocationPage = lazy(() => import("src/pages/reallocation"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: "text.primary" },
      }}
    />
  </Box>
);

export function Router() {

  return useRoutes([
    {
      element: (
        <PrivateRoute>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </PrivateRoute>
      ),
      children: [
        {
          element: (
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          ),
          children: [
            { element: <HomePage />, index: true },
            { path: "envelopes", element: <EnvelopePage /> },
            { path: "transferencia", element: <ReallocationPage /> },
            { path: "renda", element: <IncomesPage /> },
            { path: "configuracoes", element: <SettingsPage /> },
            { path: "perfil", element: <ProfilePage /> },
          ],
        },
        {
          path: "completar-cadastro",
          element: (
            <NavlessLayout>
              <CompleteRegistration />
            </NavlessLayout>
          ),
        },
      ],
    },
    {
      path: "entrar",
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: "cadastro",
      element: (
        <SimpleLayout>
          <Registration />
        </SimpleLayout>
      ),
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
