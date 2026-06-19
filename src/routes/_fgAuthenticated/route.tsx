import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_fgAuthenticated")({
  component: Outlet,
  beforeLoad: ({ context }) => {
    console.log(context);
    if (context.auth.jwtPayload?.securityLevel !== "FG") {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  },
});
