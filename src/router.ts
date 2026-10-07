import { createRouter } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
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
