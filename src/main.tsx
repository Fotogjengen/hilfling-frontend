import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { router } from "./router";
import AuthProvider from "./contexts/AuthProvider";
import { useAuth } from "./contexts/AuthenticationContext";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";

const queryClient = new QueryClient();

const RouterWrapper = () => {
  const { isAuthenticated, jwtPayload } = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{ auth: { isAuthenticated, jwtPayload } }}
    />
  );
};

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <RouterWrapper />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
