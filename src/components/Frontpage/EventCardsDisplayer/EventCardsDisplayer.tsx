import { useState, useEffect } from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../ui/navigation/Tabs";
import { EventCardDto } from "../../../../generated";
import EventCards from "../EventCards/EventCards";
import { EventCardApi } from "../../../utils/api/EventCardApi";

type EventType = "Samfundet" | "ISFIT" | "UKA";

const EventCardsDisplayer = () => {
  const [value, setValue] = useState<EventType>("Samfundet");
  const [samfundetEvents, setSamfundetEvents] = useState<EventCardDto[]>([]);
  const [isfitEvents, setIsfitEvents] = useState<EventCardDto[]>([]);
  const [ukaEvents, setUkaEvents] = useState<EventCardDto[]>([]);
  const [isSamfundetLoading, setIsSamfundetLoading] = useState<boolean>(true);
  const [isIsfitLoading, setIsIsfitLoading] = useState<boolean>(true);
  const [isUkaLoading, setIsUkaLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEventCards("Samfundet");
  }, []);

  useEffect(() => {
    loadEventCards(value);
  }, [value]);

  const loadEventCards = (eventType: EventType) => {
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
    void EventCardApi.getLatestEventCards(eventType, 3)
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

  return (
    <Tabs value={value} onValueChange={(v) => setValue(v as EventType)}>
      <TabsList>
        <TabsTrigger value="Samfundet">SAMFUNDET</TabsTrigger>
        <TabsTrigger value="ISFIT">ISFIT</TabsTrigger>
        <TabsTrigger value="UKA">UKA</TabsTrigger>
      </TabsList>
      <TabsContent value="Samfundet">
        {isSamfundetLoading ? (
          <div>Laster Samfundet-arrangementer...</div>
        ) : (
          <EventCards
            titleSize={1.2}
            event="Samfundet"
            eventCardResponse={samfundetEvents}
          />
        )}
      </TabsContent>
      <TabsContent value="ISFIT">
        {isIsfitLoading ? (
          <div>Laster ISFIT-arrangementer...</div>
        ) : (
          <EventCards
            titleSize={1.2}
            event="ISFIT"
            eventCardResponse={isfitEvents}
          />
        )}
      </TabsContent>
      <TabsContent value="UKA">
        {isUkaLoading ? (
          <div>Laster UKA-arrangementer...</div>
        ) : (
          <EventCards
            titleSize={1.2}
            event="UKA"
            eventCardResponse={ukaEvents}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default EventCardsDisplayer;
