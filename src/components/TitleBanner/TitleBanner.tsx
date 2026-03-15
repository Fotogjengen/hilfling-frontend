import React, { FC, ReactNode } from "react";
import styles from "./TitleBanner.module.css";
import { PhotoDto } from "../../../generated";

interface Props {
  photo: PhotoDto;
  styling?: string;
}

const TitleBanner = ({ photo, styling }: Props) => {
  let bannerStyle = styles.titleBannerSlideShow;

  if (styling == "ScrapBook") {
    bannerStyle = styles.titleBannerPhotos;
  }

  const date = new Date(photo.dateTaken);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate: string = date.toLocaleString(undefined, options);
  console.log(formattedDate);

  return (
    <div className={bannerStyle}>
      <div className={styles.titleBannerText}> {photo.motive.title} </div>
      <div className={styles.titleBannerText}> {formattedDate} </div>
    </div>
  );
};

export default TitleBanner;
