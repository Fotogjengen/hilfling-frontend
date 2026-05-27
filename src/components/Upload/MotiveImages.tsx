import { usePhotosByMotiveId } from "@/hooks/photo";
import { MotiveDto } from "../../../generated";
import styles from "./MotiveImages.module.css";
import { Spinner } from "../Icons/Spinner";
import { UploadedPhoto } from "./UploadedPhoto";
import PhotoUploadModal from "./PhotoUploadModal";

type MotiveImagesProps = {
  motive?: MotiveDto | null;
  isCreatingNewMotive?: boolean;
};

export default function MotiveImages({
  motive,
  isCreatingNewMotive,
}: MotiveImagesProps) {
  if (isCreatingNewMotive) {
    return (
      <div className={styles.noMotiveSelected}>
        Opprett arrangementet for å laste opp bilder.
      </div>
    );
  }

  if (!motive) {
    return (
      <div className={styles.noMotiveSelected}>
        Du har ikke valgt et arrangement.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollArea}>
        <InnerMotiveImages motive={motive} />
      </div>
      <PhotoUploadModal motive={motive} />
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
    return <Spinner />;
  }

  if (isError) {
    return <div>Kunne ikke hente bilder</div>;
  }

  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <UploadedPhoto photo={photo} key={photo.photoId.id} />
      ))}
    </div>
  );
}
