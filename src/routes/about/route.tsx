import {
  createFileRoute,
  Outlet,
  useMatchRoute,
  useNavigate,
} from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

type TabValue = "members" | "info" | "history";

const TAB_ROUTES: Record<TabValue, string> = {
  members: "/about",
  info: "/about/info",
  history: "/about/history",
};

function getTabValue(matchRoute: ReturnType<typeof useMatchRoute>): TabValue {
  if (matchRoute({ to: "/about/info" })) return "info";
  if (matchRoute({ to: "/about/history" })) return "history";
  return "members";
}

function RouteComponent() {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    void navigate({ to: TAB_ROUTES[value as TabValue] });
  };

  return (
    <Tabs value={getTabValue(matchRoute)} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="members">Fotogjengere</TabsTrigger>
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="history">Historie</TabsTrigger>
      </TabsList>
      <Outlet />
    </Tabs>
  );
}
