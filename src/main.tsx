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
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://e914ff2a103391d81503f40753b9c50b@sentry.klve.no/2",
  environment: import.meta.env.MODE,
  release:
    typeof __SENTRY_RELEASE__ !== "undefined" ? __SENTRY_RELEASE__ : undefined,
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
  },
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/arim-fg\.samfundet\.no/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
