import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { AppBar, Tab, Tabs } from "@mui/material";
import styles from "./about.module.css";
import TabPanel from "@/components/TabPanel/TabPanel";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const matchRoute = useMatchRoute();

  // Determine active tab based on current route
  const getTabValue = () => {
    if (matchRoute({ to: "/about/info" })) return 1;
    if (matchRoute({ to: "/about/history" })) return 2;
    return 0;
  };

  const tabValue = getTabValue();

  return (
    <div className={styles.container}>
      <AppBar position="static" color="default">
        <Tabs
          value={getTabValue()}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="about tabs"
        >
          <Tab label="Fotogjengere" component={Link} to="/about" />
          <Tab label="Info" component={Link} to="/about/info" />
          <Tab label="Historie" component={Link} to="/about/history" />
        </Tabs>
      </AppBar>
      <TabPanel index={tabValue} value={tabValue}>
        <Outlet />
      </TabPanel>
    </div>
  );
}
