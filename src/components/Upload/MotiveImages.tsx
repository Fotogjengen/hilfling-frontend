import type { UseQueryResult } from "@tanstack/react-query";
import { usePhotosByMotiveId } from "@/hooks/photo";
import { MotiveDto, PhotoDto } from "../../../generated";
import styles from "./MotiveImages.module.css";
import { UploadedPhoto, UploadedPhotoSkeleton } from "./UploadedPhoto";
import PhotoUploadModal from "./PhotoUploadModal";
import PhotoTable from "./PhotoTable";
import MotiveImagesHeader from "./MotiveImagesHeader";
import { ImageViewMode } from "./MotiveImagesTopbar";
import { PhotoTableState, usePhotoTableState } from "./usePhotoTableState";

type MotiveImagesProps = {
  motive?: MotiveDto | null;
  isCreatingNewMotive?: boolean;
  viewMode: ImageViewMode;
  onViewModeChange: (mode: ImageViewMode) => void;
};

export default function MotiveImages({
  motive,
  isCreatingNewMotive,
  viewMode,
  onViewModeChange,
}: MotiveImagesProps) {
  return (
    <div className={styles.wrapper}>
      {motive && !isCreatingNewMotive ? (
        <InnerMotiveImages
          key={motive.motiveId.id}
          motive={motive}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      ) : (
        <div className={styles.scrollArea}>
          <div className={styles.noMotiveSelected}>
            {isCreatingNewMotive
              ? "Opprett arrangementet for å laste opp bilder."
              : "Du har ikke valgt et arrangement."}
          </div>
        </div>
      )}
      <PhotoUploadModal motive={motive ?? null} />
    </div>
  );
}

// Inner component to allow for fetching of photos
function InnerMotiveImages({
  motive,
  viewMode,
  onViewModeChange,
}: {
  motive: MotiveDto;
  viewMode: ImageViewMode;
  onViewModeChange: (mode: ImageViewMode) => void;
}) {
  const motiveId = motive.motiveId.id;
  const photosQuery = usePhotosByMotiveId(motiveId);
  const tableState = usePhotoTableState(motiveId);

  return (
    <>
      <MotiveImagesHeader
        title={motive.title}
        motiveId={motiveId}
        photos={photosQuery.data ?? []}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        tableState={tableState}
      />
      <div className={styles.scrollArea}>
        <MotiveImagesBody
          motive={motive}
          photosQuery={photosQuery}
          viewMode={viewMode}
          tableState={tableState}
        />
      </div>
    </>
  );
}

function MotiveImagesBody({
  motive,
  photosQuery,
  viewMode,
  tableState,
}: {
  motive: MotiveDto;
  photosQuery: UseQueryResult<PhotoDto[]>;
  viewMode: ImageViewMode;
  tableState: PhotoTableState;
}) {
  if (photosQuery.isPending) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <UploadedPhotoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (photosQuery.isError) {
    return <div>Kunne ikke hente bilder</div>;
  }

  const photos = photosQuery.data;

  if (photos.length === 0) {
    return (
      <div className={styles.noMotiveSelected}>
        {motive.title} har ingen bilder enda. Vær den første til å laste opp!
      </div>
    );
  }

  if (viewMode === "table") {
    return <PhotoTable photos={photos} tableState={tableState} />;
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
