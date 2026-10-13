import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_fgAuthenticated/fg/archiveBoss/")({
  beforeLoad: () => {
    throw redirect({ to: "/fg/archiveBoss/albums", replace: true });
  },
});
