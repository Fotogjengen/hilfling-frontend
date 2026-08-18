import {
  createFileRoute,
  Outlet,
  useMatchRoute,
  useNavigate,
} from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";

export const Route = createFileRoute("/om-oss")({
  component: RouteComponent,
});

type TabValue = "about" | "order" | "useOurPictures";

const TAB_ROUTES: Record<TabValue, string> = {
  about: "/om-oss",
  order: "/om-oss/bestilling",
  useOurPictures: "/om-oss/bruk-av-bilder",
};

function getTabValue(matchRoute: ReturnType<typeof useMatchRoute>): TabValue {
  if (matchRoute({ to: "/om-oss/bestilling" })) return "order";
  if (matchRoute({ to: "/om-oss/bruk-av-bilder" })) {
    return "useOurPictures";
  }
  return "about";
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
        <TabsTrigger value="about">Om oss</TabsTrigger>
        <TabsTrigger value="order">Bestilling</TabsTrigger>
        <TabsTrigger value="useOurPictures">Bruk av bilder</TabsTrigger>
      </TabsList>
      <Outlet />
    </Tabs>
  );
}
