import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_fgAuthenticated/fg/archiveBoss/")({
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/fg/archiveBoss/albums", replace: true });
  },
});
