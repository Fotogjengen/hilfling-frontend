import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { PhotoDto } from "../../../generated";
import styles from "./UploadedPhoto.module.css";
import { IconButton } from "../ui/input/IconButton";
import { confirmDialog } from "../ui/overlay/ConfirmDialog";
import { useDeletePhoto, useUpdateGoodPicture } from "@/hooks/photo";

type UploadedPhotoProps = {
  photo: PhotoDto;
  motiveId: string;
  onOpen: () => void;
};

export function UploadedPhotoSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.imageWrapper} skeleton`} />
      <div className={styles.actions}>
        <IconButton
          aria-label="Marker som god"
          variant="subtle"
          size="sm"
          disabled
        >
          <Star size={20} className="skeleton" />
        </IconButton>
        <IconButton
          aria-label="Slett bilde"
          variant="subtle-danger"
          size="sm"
          disabled
        >
          <Trash2 size={20} />
        </IconButton>
      </div>
    </div>
  );
}

export function UploadedPhoto({ photo, motiveId, onOpen }: UploadedPhotoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { mutate: updateGoodPicture } = useUpdateGoodPicture(motiveId);
  const { mutate: deletePhoto } = useDeletePhoto(motiveId);

  return (
    <div className={styles.card}>
      <div className={`${styles.imageWrapper} ${!isLoaded ? "skeleton" : ""}`}>
        <img
          className={`${styles.image} ${!isLoaded ? styles.imageLoading : ""}`}
          src={photo.imageThumb}
          alt="Opplastet bilde"
          onLoad={() => setIsLoaded(true)}
          onClick={onOpen}
        />
      </div>
      <div className={styles.actions}>
        <IconButton
          aria-label="Marker som god"
          variant="subtle"
          size="sm"
          onClick={() => {
            updateGoodPicture({
              photoId: photo.photoId.id,
              goodPicture: !photo.goodPicture,
            });
          }}
        >
          <Star
            size={20}
            className={photo.goodPicture ? styles.filledStar : undefined}
          />
        </IconButton>
        <IconButton
          aria-label="Slett bilde"
          variant="subtle-danger"
          size="sm"
          onClick={() =>
            confirmDialog.error("Slett bilde?", {
              description: "Bildet slettes permanent. Dette kan ikke angres.",
              confirmLabel: "Slett",
              onConfirm: () => deletePhoto(photo.photoId.id),
            })
          }
        >
          <Trash2 size={20} />
        </IconButton>
      </div>
    </div>
  );
}
