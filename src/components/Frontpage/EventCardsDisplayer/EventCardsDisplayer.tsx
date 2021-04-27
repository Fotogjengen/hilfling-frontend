import React, { ChangeEvent, FC, useState } from "react";
import {
  GuiCardPreamble,
  GuiCardTitle,
  GuiImageCard,
} from "../../../gui-components";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import TabPanel from "../../TabPanel/TabPanel";
import { useEffect } from "react";
import axios from "axios";

// TODO: this should still be here for when data from database gets collected higher in the component tree.
interface Props {
  title?: string;
  images?: number;
  date?: string;
  location?: string;
  image?: string;
}

export interface IMotive {
  id: string;
  dateCreated: string;
  title: string;
  category: {
    id: string;
    dateCreated: string;
    name: string;
  };
  eventOwner: {
    id: string;
    dateCreated: string;
    name: string;
  };
  album: {
    id: string;
    dateCreated: string;
    title: string;
    isAnalog: boolean;
  };
}

// TODO: Move to top of the page (component tree)
const EventCardsDisplayer: FC<Props> = () => {
  useEffect(() => {
    try {
      void axios.get(`http://localhost:8080/motives/`).then((res) => {
        setMotiveResponse(res.data);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [value, setValue] = useState<number>(0);
  const [motiveResponse, setMotiveResponse] = useState<IMotive[]>([]);

  const imageCardsSamf = motiveResponse.map((motiveObject, index) => {
    return (
      // TODO: Placement, type, location, type and image should be from motiveObject when backend is done
      <GuiImageCard
        key={`image-card-${index}`}
        placement="left"
        type="samfundet"
        image="https://www.w3schools.com/css/img_lights.jpg"
      >
        <GuiCardTitle capitalized title={motiveObject.title} />
        <GuiCardPreamble
          color="red"
          date={motiveObject.dateCreated}
          images={69420}
          location="Blåfjell"
          type="EventCard"
        />
      </GuiImageCard>
    );
  });

  const imageCardsIsfit = ["Et flott sted ISFiT liker"].map(
    (placeName, index) => {
      return (
        <GuiImageCard
          key={`image-card-${index}`}
          placement={"left"}
          type="samfundet"
          image={"https://www.w3schools.com/css/img_lights.jpg"}
        >
          <GuiCardTitle capitalized title={"Temafest: Gjøre verden bedre"} />
          <GuiCardPreamble
            color="red"
            date="12.10.2020"
            images={123}
            location={placeName}
            type={"EventCard"}
          />
        </GuiImageCard>
      );
    },
  );

  const imageCardsUka = ["Fæffæs lommebok", "BI"].map((placeName, index) => {
    return (
      <GuiImageCard
        key={`image-card-${index}`}
        placement={"left"}
        type="samfundet"
        image={"https://www.w3schools.com/css/img_lights.jpg"}
      >
        <GuiCardTitle capitalized title={"Temafest: Tjene $$$"} />
        <GuiCardPreamble
          color="red"
          date="12.10.2020"
          images={123}
          location={placeName}
          type={"EventCard"}
        />
      </GuiImageCard>
    );
  });

  const handleChange = (
    event: ChangeEvent<Record<string, unknown>>,
    newValue: number,
  ) => {
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
        {imageCardsSamf}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {imageCardsIsfit}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {imageCardsUka}
      </TabPanel>
    </>
  );
};

export default EventCardsDisplayer;
