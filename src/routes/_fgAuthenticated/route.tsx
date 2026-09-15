import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_fgAuthenticated")({
  component: Outlet,
  beforeLoad: ({ context }) => {
    console.log(context.auth.user?.isExternalUser);
    if (
      context.auth.user?.securityLevel !== "FG" ||
      context.auth.user?.isExternalUser
    ) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  },
});
