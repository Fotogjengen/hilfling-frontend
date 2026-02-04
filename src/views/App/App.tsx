import React, { FC } from "react";
import styles from "./App.module.css";
import EventCardsDisplayer from "../../components/Frontpage/EventCardsDisplayer/EventCardsDisplayer";
import CardInformationFotogjengen from "../../components/Frontpage/CardInformationFotogjengen/CardInformationFotogjengen";
import Carousel from "../../components/Frontpage/Carousel/Carousel";

const App: FC = (/* { auth } */) => {
  throw new Error("Test error boundary");
  return (
    <div className={styles.contentContainer}>
      <div className={styles.leftSide}>
        <div className={styles.CaroContainer}>
          <Carousel />
        </div>
        <div className={styles.events}>
          <h2>BILDER FRA:</h2>
          <EventCardsDisplayer />
        </div>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.fotogjengen}>
          <CardInformationFotogjengen
            title="Fotogjengen"
            description="Fotogjengen er en gjeng ved Studentersamfundet i Trondheim. Vi har ansvar for å dokumentere
          alt som skjer på Samfundet, under UKA og ISFIT. Alle bilder vi tar legges ut på denne
          nettsiden."
          />
        </div>
        <div className={styles.fotogjengen}>
          <CardInformationFotogjengen
            title="Anmodning"
            description="Trenger du en fotograf? Fotogjengen kan hjelpe deg!"
            link="/about?tab=1"
          />
        </div>
        <div className={styles.fotogjengen}>
          <CardInformationFotogjengen
            title="Kreditering"
            description={`Alle bilder tatt av Fotogjengen skal krediteres med: \nFoto: foto.samfundet.no\n`}
            link="/about?tab=1"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
