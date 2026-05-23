import { createFileRoute } from "@tanstack/react-router";
import PhotoUploadForm from "@/forms/PhotoUploadForm";
import styles from "./upload.module.css";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/upload",
)({
  component: PhotoUpload,
});

function PhotoUpload() {
  return (
    <div className={styles.photoUpload}>
      <h2>Last opp bilder</h2>
      <PhotoUploadForm />
    </div>
  );
}

export default PhotoUpload;
