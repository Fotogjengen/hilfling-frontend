import React, { FC, SyntheticEvent, useState, useEffect } from "react";

import { AppBar, Tabs, Tab } from "@mui/material";
import TabPanel from "../../TabPanel/TabPanel";

import { EventCardDto, MotiveDto } from "../../../../generated";
import EventCards from "../EventCards/EventCards";
import { EventCardApi } from "../../../utils/api/EventCardApi";

interface Props {
  title?: string;
  images?: number;
  date?: string;
  location?: string;
  image?: string;
}

const EventCardsDisplayer: FC<Props> = () => {
  const [value, setValue] = useState<number>(0);
  const [samfundetEvents, setSamfundetEvents] = useState<EventCardDto[]>([]);
  const [isfitEvents, setIsfitEvents] = useState<EventCardDto[]>([]);
  const [ukaEvents, setUkaEvents] = useState<EventCardDto[]>([]);
  const [isSamfundetLoading, setIsSamfundetLoading] = useState<boolean>(true);
  const [isIsfitLoading, setIsIsfitLoading] = useState<boolean>(true);
  const [isUkaLoading, setIsUkaLoading] = useState<boolean>(true);

  // Load initial tab content on component mount
  useEffect(() => {
    // Load initial tab content (SAMFUNDET)
    loadEventCards("Samfundet");
  }, []);

  // Load event cards when tab changes
  useEffect(() => {
    const eventTypes = ["Samfundet", "ISFIT", "UKA"];
    const currentEvent = eventTypes[value];
    loadEventCards(currentEvent);
  }, [value]);

  const loadEventCards = (eventType: string) => {
    switch (eventType) {
      case "Samfundet":
        setIsSamfundetLoading(true);
        break;
      case "ISFIT":
        setIsIsfitLoading(true);
        break;
      case "UKA":
        setIsUkaLoading(true);
        break;
    }
    EventCardApi.getLatestEventCards(eventType, 6)
      .then((res) => {
        const events = res || [];

        switch (eventType) {
          case "Samfundet":
            setSamfundetEvents(events);
            setIsSamfundetLoading(false);

            break;
          case "ISFIT":
            setIsfitEvents(events);
            setIsIsfitLoading(false);

            break;
          case "UKA":
            setUkaEvents(events);
            setIsUkaLoading(false);

            break;
        }
      })
      .catch((e) => {
        console.log(e);
        // Set loading to false even on error
        switch (eventType) {
          case "Samfundet":
            setIsSamfundetLoading(false);
            break;
          case "ISFIT":
            setIsIsfitLoading(false);
            break;
          case "UKA":
            setIsUkaLoading(false);
            break;
        }
      });
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="event card tabs"
        >
          <Tab label="SAMFUNDET" />
          <Tab label="ISFIT" />
          <Tab label="UKA" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {isSamfundetLoading ? (
          <div>Loading Samfundet events...</div>
        ) : (
          <EventCards event={"Samfundet"} eventCardResponse={samfundetEvents} />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {isIsfitLoading ? (
          <div>Loading ISFIT events...</div>
        ) : (
          <EventCards event={"ISFIT"} eventCardResponse={isfitEvents} />
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {isUkaLoading ? (
          <div>Loading UKA events...</div>
        ) : (
          <EventCards event={"UKA"} eventCardResponse={ukaEvents} />
        )}
      </TabPanel>
    </>
  );
};

export default EventCardsDisplayer;
