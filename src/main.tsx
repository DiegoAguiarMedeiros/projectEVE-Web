import ReactDOM from "react-dom/client";
import { Suspense, StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";

import App from "./app";
// import { AuthProvider } from "./context/AuthProvider";

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient();


root.render(
  <StrictMode>
    <BrowserRouter>
      <Suspense>
        {/* <AuthProvider> */}
        <SnackbarProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </SnackbarProvider>
        {/* </AuthProvider> */}
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
