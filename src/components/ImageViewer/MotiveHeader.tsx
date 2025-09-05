import { PhotoDto } from "../../../generated";
import React, { useState, useEffect } from "react";
import { PhotoApi } from "../../utils/api/PhotoApi";
import GridImageViewer from "./GridImageViewer";
import styles from "./imageStyle.module.css";
import { useNavigate, useParams } from "react-router-dom";

const MotiveHeader = () => {
  const [photoResponse, setPhotoResponse] = useState<PhotoDto[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      PhotoApi.getAllByMotiveId(id)
        .then((res) => setPhotoResponse(res))
        .catch((e) => console.log(e));
    }
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className={styles.backgroundFlex}>
      <div className={styles.imageHeader}>
        <button onClick={handleBackClick} className={styles.backButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
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
