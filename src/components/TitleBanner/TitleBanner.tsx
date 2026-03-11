
import React, { FC, ReactNode } from "react";
import styles from "./TitleBanner.module.css"
import { PhotoDto } from "../../../generated";

interface Props {
  photo: PhotoDto;
}


const TitleBanner  = ( {photo} : Props) => {
  return (
    <div className={styles.titleBanner}>
    <div > {photo.motive.title} </div>
    <div > {photo.dateTaken} </div>
    </div>

  );
};

export default TitleBanner;