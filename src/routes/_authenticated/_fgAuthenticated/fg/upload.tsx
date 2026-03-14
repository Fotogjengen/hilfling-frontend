import { createFileRoute } from "@tanstack/react-router";
import { Grid, Typography } from "@mui/material";
import PhotoUploadForm, { PhotoUploadFormIV } from "@/forms/PhotoUploadForm";
import styles from "./upload.module.css";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/upload",
)({
  component: PhotoUpload,
});

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

function PhotoUpload() {
  return (
    <div className={styles.photoUpload}>
      <Typography variant="h2" gutterBottom>
        Last opp bilder
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PhotoUploadForm initialValues={initialValues} />
        </Grid>
      </Grid>
    </div>
  );
}

export default PhotoUpload;
