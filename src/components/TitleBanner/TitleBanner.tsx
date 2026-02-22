
import React, { FC, ReactNode } from "react";
import styles from "./TitleBanner.module.css"
import { PhotoDto } from "../../../generated";

interface Props {
  photo: PhotoDto;
}


const TitleBanner  = ( ) => {
  return (
    <div className={styles.titleBanner}> hei </div>

  );
};

export default TitleBanner;