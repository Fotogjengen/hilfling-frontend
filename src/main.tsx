import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { router } from "./router";
import AuthProvider, { useAuth } from "./contexts/AuthProvider";
import PhotoDownloadProvider from "./contexts/PhotoDownloadProvider";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { isAxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // if not triggered by axios, lets do 3 retries
        if (!isAxiosError(error) || error.response?.status === undefined) {
          return failureCount < 3;
        }

        // we can safely ignore refetching client errors
        if (error.response?.status >= 400) {
          return false;
        }

        // 3 retries
        return failureCount < 3;
      },
    },
  },
});

const RouterWrapper = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{ auth: { isAuthenticated, user } }}
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
            <PhotoDownloadProvider>
              <RouterWrapper />
            </PhotoDownloadProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
