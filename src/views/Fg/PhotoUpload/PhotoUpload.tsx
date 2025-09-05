import React, { FC } from "react";
import { Grid, Typography } from "@mui/material";
import PhotoUploadForm, {
  PhotoUploadFormIV,
} from "../../../forms/PhotoUploadForm";
import styles from "./PhotoUpload.module.css";

const initialValues: PhotoUploadFormIV = {
  album: "",
  date: new Date(Date.now()),
  motive: "",
  tags: [],
  category: "",
  place: "",
  securityLevel: "",
  eventOwner: "",
};

const PhotoUpload: FC = () => {
  return (
    <div className={styles.photoUpload}>
      <Typography variant="h2" gutterBottom>Last opp bilder</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PhotoUploadForm initialValues={initialValues} />
        </Grid>
      </Grid>
    </div>
  );
};

export default PhotoUpload;
