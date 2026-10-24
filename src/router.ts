import { createRouter } from "@tanstack/react-router";
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
  defaultErrorComponent: RouteError,
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
