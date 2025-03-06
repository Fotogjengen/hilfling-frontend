import React, { FC } from "react";
import { GuiCard, GuiCardTitle } from "../../../gui-components";

const CardInformationFotogjengen: FC = () => {
  return (
    <div>
      <GuiCard>
        <GuiCardTitle title={"Fotogjengen"} capitalized={true} />
        <p>
          Fotogjengen er en gjeng på Samfundet. Vi har ansvar for å dokumentere
          alt som skjer på huset. Alle bilder vi tar legges ut på denne
          nettsiden. Ønsker du å bruke noen av bildene våre. Venligst krediter
          foto med: foto.samfundet.no.
        </p>
        <p>
          <a
            style={{ color: "#ad2f33" }}
            href="https://foto.samfundet.no/informasjon/"
          >
            Les mer om oss her.
          </a>
        </p>
      </GuiCard>
    </div>
  );
};

export default CardInformationFotogjengen;
