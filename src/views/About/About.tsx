import React, { FC, useState, SyntheticEvent, useEffect } from "react";

import { AppBar, Tab, Tabs } from "@mui/material";
import TabPanel from "../../components/TabPanel/TabPanel";

import InfoTab from "./Tabs/InfoTab";
import HistoryTab from "./Tabs/HistoryTab";
import AboutTab from "./Tabs/AboutTab";
import styles from "./About.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const About: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState<number>(0);

  // Function to get tab index from URL query
  const getTabIndexFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") ? Number(params.get("tab")) : 0;
  };

  // Sync tab value with URL on load
  useEffect(() => {
    setTabValue(getTabIndexFromURL());
  }, [location]);

  const handleTabChange = (event: SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
    navigate(`?tab=${newTabValue}`); // Update URL when tab changes
  };

  return (
    <div className={styles.container}>
      <AppBar position="static" color="default">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="about tabs"
        >
          <Tab label="Om oss" />
          <Tab label="Info" />
          <Tab label="Historie" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <AboutTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <InfoTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <HistoryTab />
      </TabPanel>
    </div>
  );
};

export default About;
