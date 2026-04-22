import React, { FC } from "react";
import { Typography } from "@mui/material";
import styles from "./NotFound.module.css";
import image from "./404.png";

const NotFound: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.notFound}>
        <img src={image} alt="404" />
        <Typography paragraph={true} variant={"subtitle1"}>
          Shoot! Her gikk noe galt... Denne siden ser ikke ut til å eksistere.
          Hvis det er noe du mener er feil kan du sende en mail til
          <a href={"mailto:fotogjengen@samfundet.no"}>
            fotogjengen@samfundet.no
          </a>
          . Forsiden finner du <a href={"https://foto.samfundet.no/"}>her</a>.
        </Typography>
      </div>
    </div>
  );
};

export default NotFound;
