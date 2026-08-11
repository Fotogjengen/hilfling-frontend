import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_fgAuthenticated")({
  component: Outlet,
  beforeLoad: ({ context }) => {
    if (context.auth.user?.securityLevel !== "FG") {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  },
});
