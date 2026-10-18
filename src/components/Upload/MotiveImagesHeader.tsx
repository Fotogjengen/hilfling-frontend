import { useState } from "react";
import { ArrowRight, Check, Download, Pencil, Save } from "lucide-react";
import { PhotoDto } from "../../../generated";
import { Button } from "../ui/input/Button";
import MotiveImagesTopbar, { ImageViewMode } from "./MotiveImagesTopbar";
import MovePhotosDialog from "./MovePhotosDialog";
import PhotoTableBanner from "./PhotoTableBanner";
import { PhotoTableState } from "./usePhotoTableState";
import { useMovePhotos, useSavePhotoChanges } from "@/hooks/photo";
import { usePhotoDownload } from "@/contexts/PhotoDownloadProvider";

type MotiveImagesHeaderProps = {
  title: string;
  motiveId: string;
  photos: PhotoDto[];
  viewMode: ImageViewMode;
  onViewModeChange: (mode: ImageViewMode) => void;
  tableState: PhotoTableState;
};

function pluralizePhotos(count: number) {
  return `${count} ${count === 1 ? "bilde" : "bilder"}`;
}

export default function MotiveImagesHeader({
  title,
  motiveId,
  photos,
  viewMode,
  onViewModeChange,
  tableState,
}: MotiveImagesHeaderProps) {
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const { mutate: saveChanges, isPending: isSaving } =
    useSavePhotoChanges(motiveId);
  const { mutate: movePhotos, isPending: isMoving } = useMovePhotos(motiveId);
  const { requestDownload } = usePhotoDownload();

  const {
    mode,
    setMode,
    setRowSelection,
    rowSelection,
    photoPatches,
    deletedPhotoIds,
    changedCount,
    exitMode,
  } = tableState;

  const selectedPhotos = photos.filter(
    (photo) => rowSelection[photo.photoId.id],
  );

  if (mode === "edit") {
    return (
      <PhotoTableBanner
        message={`Endret ${pluralizePhotos(changedCount)}`}
        onClose={exitMode}
      >
        <Button
          size="sm"
          disabled={changedCount === 0 || isSaving}
          onClick={() =>
            saveChanges(
              {
                photoPatches,
                deletedPhotoIds,
              },
              { onSuccess: exitMode },
            )
          }
        >
          <Save size={16} aria-hidden="true" />
          Lagre endringer
        </Button>
      </PhotoTableBanner>
    );
  }

  if (mode === "select") {
    return (
      <>
        <PhotoTableBanner
          message={`${pluralizePhotos(selectedPhotos.length)} valgt`}
          onClose={exitMode}
        >
          <Button
            size="sm"
            disabled={selectedPhotos.length === 0}
            onClick={() => setIsMoveDialogOpen(true)}
          >
            <ArrowRight size={16} aria-hidden="true" />
            Flytt
          </Button>
          <Button
            size="sm"
            disabled={selectedPhotos.length === 0}
            onClick={() => requestDownload(selectedPhotos)}
          >
            <Download size={16} aria-hidden="true" />
            Last ned
          </Button>
        </PhotoTableBanner>
        {isMoveDialogOpen && (
          <MovePhotosDialog
            currentMotiveId={motiveId}
            photoCount={selectedPhotos.length}
            isMoving={isMoving}
            onClose={() => setIsMoveDialogOpen(false)}
            onMove={(targetMotiveId) =>
              movePhotos(
                {
                  photoIds: selectedPhotos.map((photo) => photo.photoId.id),
                  targetMotiveId,
                },
                {
                  onSuccess: () => {
                    setIsMoveDialogOpen(false);
                    setRowSelection({});
                  },
                },
              )
            }
          />
        )}
      </>
    );
  }

  return (
    <MotiveImagesTopbar
      title={title}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
    >
      {viewMode === "table" && (
        <>
          <Button variant="neutral" size="sm" onClick={() => setMode("select")}>
            <Check size={18} aria-hidden="true" />
            Velg bilder
          </Button>
          <Button variant="neutral" size="sm" onClick={() => setMode("edit")}>
            <Pencil size={18} aria-hidden="true" />
            Endre bilder
          </Button>
        </>
      )}
    </MotiveImagesTopbar>
  );
}
