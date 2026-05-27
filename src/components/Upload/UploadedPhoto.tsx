import { Star, Trash2 } from "lucide-react";
import { PhotoDto } from "../../../generated";
import styles from "./UploadedPhoto.module.css";

type UploadedPhotoProps = {
  photo: PhotoDto;
};

export function UploadedPhoto({ photo }: UploadedPhotoProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={photo.imageThumb}
          alt="Opplastet bilde"
        />
      </div>
      <div className={styles.actions}>
        <button className={styles.actionButton}>
          <Star
            size={20}
            className={photo.goodPicture ? styles.filledStar : undefined}
          />
        </button>
        <button className={`${styles.actionButton} ${styles.deleteButton}`}>
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
