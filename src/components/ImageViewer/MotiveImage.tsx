import React, { FC } from "react";

import styles from "./imageStyle.module.css";
import { PhotoDto } from "../../../generated";

interface Props {
  id: string;
  image: string;
  imageListProp: PhotoDto[];
  index: number;
  updateIndex: (index: number) => void;
  title: string;
}

const MotiveImage: FC<Props> = ({
  image,
  index,
  updateIndex,
  title,
}: Props) => {
  return (
    <>
      <div className={styles.motiveImage} onClick={() => updateIndex(index)}>
        <img src={image} width="250px" />
        <div className={styles.imageContainer}>
          <p className={styles.imageTitle}>{title}</p>
          <p className={styles.imageTitle}>31.08.21</p>
        </div>
      </div>
    </>
  );
};

export default MotiveImage;
