import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

// This route wraps all authenticated routes to disallow acces to unauthenticated users.
export const Route = createFileRoute("/_authenticated")({
  component: Outlet,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  },
});
