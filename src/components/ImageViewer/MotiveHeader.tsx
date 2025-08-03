import { PhotoDto } from "../../../generated";
import React, { useState, useEffect } from "react";
import { PhotoApi } from "../../utils/api/PhotoApi";
import GridImageViewer from "./GridImageViewer";
import styles from "./imageStyle.module.css";
import { useParams } from "react-router-dom";

const MotiveHeader = () => {
  const [photoResponse, setPhotoResponse] = useState<PhotoDto[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      PhotoApi.getAllByMotiveId(id)
        .then((res) => setPhotoResponse(res))
        .catch((e) => console.log(e));
    }
  }, []);

  return (
    <div className={styles.backgroundFlex}>
      <div className={styles.imageHeader}>
        <p className={styles.headerText}>
          {photoResponse[0] != null
            ? photoResponse[0].motive.title
            : "No images Found"}
        </p>
        <hr className={styles.hr} />
      </div>
      <GridImageViewer photos={photoResponse} />
    </div>
  );
};

export default MotiveHeader;
