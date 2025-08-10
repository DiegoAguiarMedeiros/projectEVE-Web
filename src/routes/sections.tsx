import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import Box from "@mui/material/Box";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";

import { varAlpha } from "src/theme/styles";
import { AuthLayout } from "src/layouts/auth";
import { SimpleLayout } from "src/layouts/simple";
import { DashboardLayout } from "src/layouts/dashboard";
import { PrivateRoute } from "./PrivateRoute";

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import("src/pages/home"));
export const BlogPage = lazy(() => import("src/pages/blog"));
export const EnvelopePage = lazy(() => import("src/pages/envelope"));
export const SignInPage = lazy(() => import("src/pages/sign-in"));
export const ProductsPage = lazy(() => import("src/pages/products"));
export const SettingsPage = lazy(() => import("src/pages/settings"));
export const CompleteRegistration = lazy(() => import("src/pages/completeRegistration"));
export const Registration = lazy(() => import("src/pages/registration"));
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
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: "envelopes", element: <EnvelopePage /> },
        { path: "configuracoes", element: <SettingsPage /> },
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
      path: "completar-cadastro",
      element: (
        <SimpleLayout>
          <CompleteRegistration />
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
