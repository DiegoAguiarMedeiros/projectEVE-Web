import ReactDOM from "react-dom/client";
import { Suspense, StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";

import App from "src/app";
import "./i18n";
import { SUPPORTED_LANGS, SupportedLang } from "src/routes/paths";

// ----------------------------------------------------------------------

function detectInitialLang(): SupportedLang {
  const candidates = [
    localStorage.getItem("i18nextLng") ?? "",
    navigator.language,
    ...(navigator.languages ?? []),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    // Exact match (e.g. "pt-BR", "en", "es")
    if (SUPPORTED_LANGS.includes(candidate as SupportedLang)) {
      return candidate as SupportedLang;
    }
    // Prefix match: "en-US" → "en", "pt" → "pt-BR"
    const prefix = candidate.split("-")[0].toLowerCase();
    const match = SUPPORTED_LANGS.find((l) => l.toLowerCase().startsWith(prefix));
    if (match) return match;
  }

  return "pt-BR";
}

// Redirect bare "/" to "/:lang" before React mounts, so useRoutes always
// sees a language-prefixed URL and never falls through to the catch-all.
if (window.location.pathname === "/") {
  window.history.replaceState(null, "", `/${detectInitialLang()}`);
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient();
root.render(
  <StrictMode>
    <BrowserRouter>
      <Suspense>
        <SnackbarProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </SnackbarProvider>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
