import { usePhotosByMotiveId } from "@/hooks/photo";
import { MotiveDto } from "../../../generated";
import styles from "./MotiveImages.module.css";
import { UploadedPhoto, UploadedPhotoSkeleton } from "./UploadedPhoto";
import PhotoUploadModal from "./PhotoUploadModal";

type MotiveImagesProps = {
  motive?: MotiveDto | null;
  isCreatingNewMotive?: boolean;
};

export default function MotiveImages({
  motive,
  isCreatingNewMotive,
}: MotiveImagesProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollArea}>
        {isCreatingNewMotive ? (
          <div className={styles.noMotiveSelected}>
            Opprett arrangementet for å laste opp bilder.
          </div>
        ) : !motive ? (
          <div className={styles.noMotiveSelected}>
            Du har ikke valgt et arrangement.
          </div>
        ) : (
          <InnerMotiveImages motive={motive} />
        )}
      </div>
      <PhotoUploadModal motive={motive ?? null} />
    </div>
  );
}

// Inner component to allow for fetching of photos
function InnerMotiveImages({ motive }: { motive: MotiveDto }) {
  const {
    data: photos,
    isPending,
    isError,
  } = usePhotosByMotiveId(motive.motiveId.id);

  if (isPending) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <UploadedPhotoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Kunne ikke hente bilder</div>;
  }

  if (photos.length === 0) {
    return (
      <div className={styles.noMotiveSelected}>
        {motive.title} har ingen bilder enda. Vær den første til å laste opp!
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <UploadedPhoto
          photo={photo}
          motiveId={motive.motiveId.id}
          key={photo.photoId.id}
        />
      ))}
    </div>
  );
}
