import React, { FC } from "react";
import styles from "./App.module.css";
import EventCardsDisplayer from "../../components/Frontpage/EventCardsDisplayer/EventCardsDisplayer";
import CardInformationFotogjengen from "../../components/Frontpage/CardInformationFotogjengen/CardInformationFotogjengen";
import Carousel from "../../components/Frontpage/Carousel/Carousel";
// import { withAuth } from "@okta/okta-react";
// import { useAuth } from "../../utils/auth";

const App: FC = (/* { auth } */) => {
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
            description="Fotogjengen er en gjeng på Samfundet. Vi har ansvar for å dokumentere
          alt som skjer på huset. Alle bilder vi tar legges ut på denne
          nettsiden. Ønsker du å bruke noen av bildene våre. Venligst krediter
          med foto: foto.samfundet.no."
            link="/about?tab=0"
          />
        </div>
        <div className={styles.anmoding}>
          <CardInformationFotogjengen
            title="Anmodning"
            description="Trenger du en fotograf? Fotogjengen kan hjelpe deg!"
            link="/about?tab=1"
          />
        </div>
        <div className={styles.anmoding}>
          <CardInformationFotogjengen
            title="Kredetering"
            description={`Alle bilder tatt av Fotogjengen skal krediteres med: \nFoto: foto.samfundet.no\nVed manglende kreditering kan det bli krevet kompensasjon. For spørsmål rundt bruk av våre bilder og kreditering, ta kontakt med oss på e-post.`}
            link="/about?tab=1"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
