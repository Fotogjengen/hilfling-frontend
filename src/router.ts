import { createRouter } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
import { isAxiosError } from "axios";
import { routeTree } from "./routeTree.gen";
import NotFound from "./components/NotFound/NotFound";
import RouteError from "./components/RouteError/RouteError";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound,
  // Note: defaultOnCatch only fires when an error component is set,
  // so these two options must be used together.
  defaultErrorComponent: RouteError,
  defaultOnCatch: (error, errorInfo) => {
    // Axios errors are reported centrally in `utils/api/api.tsx` (5xx only),
    // so skip them here to avoid duplicate events.
    if (isAxiosError(error)) return;
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } },
    });
  },
  context: {
    auth: {
      isAuthenticated: false,
      user: null,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
