import React, { FC } from "react";
import styles from "./EventCardsDisplayer.module.css";
import {
  GuiCardPreamble,
  GuiCardTitle,
  GuiImageCard,
} from "../../../gui-components";

interface Props {
  title?: string;
  images?: number;
  date?: string;
  location?: string;
  image?: string;
}

const EventCardsDisplayer: FC<Props> = () => {
  return (
    <div className={styles.container}>
      <GuiImageCard
        placement={"left"}
        type="samfundet"
        image={"https://www.w3schools.com/css/img_lights.jpg"}
      >
        <GuiCardTitle capitalized title={"Temafest: Halloween"} />
        <GuiCardPreamble
          color="red"
          date="12.10.2020"
          images={123}
          location={"Edgar"}
          type={"EventCard"}
        />
      </GuiImageCard>

      <GuiImageCard
        placement={"left"}
        type="samfundet"
        image={"https://www.w3schools.com/css/img_lights.jpg"}
      >
        <GuiCardTitle capitalized title={"Temafest: Caroline"} />
        <GuiCardPreamble
          color="red"
          date="12.10.2020"
          images={123}
          location={"Daglighallen"}
          type={"EventCard"}
        />
      </GuiImageCard>

      <GuiImageCard
        placement={"left"}
        type={"samfundet"}
        image={"https://www.w3schools.com/css/img_lights.jpg"}
      >
        <GuiCardTitle capitalized title={"Temafest: Oscar"} />
        <GuiCardPreamble
          color="red"
          date="12.10.2020"
          images={123}
          location={"Aqua"}
          type={"EventCard"}
        />
      </GuiImageCard>

      <GuiImageCard
        placement={"left"}
        type="samfundet"
        image={"https://www.w3schools.com/css/img_lights.jpg"}
      >
        <GuiCardTitle capitalized title={"Temafest: Taheera"} />
        <GuiCardPreamble
          color="red"
          date="12.10.2020"
          images={123}
          location={"ARK"}
          type={"EventCard"}
        />
      </GuiImageCard>
    </div>
  );
};

export default EventCardsDisplayer;
