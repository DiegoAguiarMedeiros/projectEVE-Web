import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";

import { varAlpha } from "src/theme/styles";
import { AuthLayout } from "src/layouts/auth";
import { SimpleLayout } from "src/layouts/simple";
import { DashboardLayout } from "src/layouts/dashboard";
import { NavlessLayout } from "src/layouts/navless";
import { PrivateRoute } from "./PrivateRoute";
import { LangRouteWrapper } from "./components";
import { SUPPORTED_LANGS, NON_DEFAULT_LANGS, ROUTE_SEGMENTS, SupportedLang, getPath } from "./paths";

// Redirects unknown URLs to the not-found page, inferring lang from the URL.
function NotFoundRedirect() {
  const { pathname } = useLocation();
  const firstSegment = pathname.split("/")[1] ?? "";
  const urlLang: SupportedLang = (NON_DEFAULT_LANGS as string[]).includes(firstSegment)
    ? (firstSegment as SupportedLang)
    : SUPPORTED_LANGS[0];
  return <Navigate to={getPath(urlLang, 'notFound')} replace />;
}

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
export const GoalsPage = lazy(() => import("src/pages/goals"));
export const DebtsPage = lazy(() => import("src/pages/debts"));
export const ReallocationPage = lazy(() => import("src/pages/reallocation"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));
export const VerifyEmailPage = lazy(() => import("src/pages/verify-email"));
export const ForgotPasswordPage = lazy(() => import("src/pages/forgot-password"));
export const ResetPasswordPage = lazy(() => import("src/pages/reset-password"));

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

function buildLangRoutes(lang: SupportedLang) {
  const s = ROUTE_SEGMENTS[lang];
  const isDefault = !NON_DEFAULT_LANGS.includes(lang);

  const children = [
    // Protected routes
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
            { path: s.envelopes, element: <EnvelopePage /> },
            { path: s.reallocation, element: <ReallocationPage /> },
            { path: s.incomes, element: <IncomesPage /> },
            { path: s.goals, element: <GoalsPage /> },
            { path: s.debts, element: <DebtsPage /> },
            { path: s.settings, element: <SettingsPage /> },
            { path: s.profile, element: <ProfilePage /> },
          ],
        },
        {
          path: s.completeRegistration,
          element: (
            <NavlessLayout>
              <CompleteRegistration />
            </NavlessLayout>
          ),
        },
      ],
    },
    // Public routes
    {
      path: s.signIn,
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: s.registration,
      element: (
        <SimpleLayout>
          <Registration />
        </SimpleLayout>
      ),
    },
    {
      path: s.verifyEmail,
      element: (
        <Suspense fallback={renderFallback}>
          <VerifyEmailPage />
        </Suspense>
      ),
    },
    {
      path: s.forgotPassword,
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <ForgotPasswordPage />
          </Suspense>
        </AuthLayout>
      ),
    },
    {
      path: s.resetPassword,
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <ResetPasswordPage />
          </Suspense>
        </AuthLayout>
      ),
    },
    {
      path: s.notFound,
      element: <Page404 />,
    },
  ];

  // Default lang (pt-BR): pathless layout route — children mount at root level.
  // Other langs: nested under /:lang prefix.
  if (isDefault) {
    return { element: <LangRouteWrapper lang={lang} />, children };
  }
  return { path: lang, element: <LangRouteWrapper lang={lang} />, children };
}

export function Router() {
  return useRoutes([
    ...SUPPORTED_LANGS.map(buildLangRoutes),
    { path: "*", element: <NotFoundRedirect /> },
  ]);
}
