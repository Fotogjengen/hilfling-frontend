import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFound from "./components/NotFound/NotFound";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound,
  context: {
    auth: {
      isAuthenticated: false,
      jwtPayload: null,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
