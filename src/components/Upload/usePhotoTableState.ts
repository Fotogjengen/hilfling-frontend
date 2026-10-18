import { useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { PhotoDto } from "../../../generated";
import { useUpdateGoodPicture } from "@/hooks/photo";

export type PhotoTableMode = "view" | "edit" | "select";

function omitKey<T>(record: Record<string, T>, key: string) {
  return Object.fromEntries(Object.entries(record).filter(([k]) => k !== key));
}

export function usePhotoTableState(motiveId: string) {
  const [mode, setMode] = useState<PhotoTableMode>("view");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pendingGoodPictures, setPendingGoodPictures] = useState<
    Record<string, boolean>
  >({});
  const [pendingMedias, setPendingMedias] = useState<Record<string, string>>(
    {},
  );
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);

  const { mutate: updateGoodPicture } = useUpdateGoodPicture(motiveId);

  const patchedPhotoIds = [
    ...new Set([
      ...Object.keys(pendingGoodPictures),
      ...Object.keys(pendingMedias),
    ]),
  ];
  const photoPatches = patchedPhotoIds.map((photoId) => ({
    photoId,
    patch: {
      goodPicture: pendingGoodPictures[photoId],
      mediaId: pendingMedias[photoId],
    },
  }));
  const changedCount = photoPatches.length + deletedPhotoIds.length;

  const exitMode = () => {
    setMode("view");
    setRowSelection({});
    setPendingGoodPictures({});
    setPendingMedias({});
    setDeletedPhotoIds([]);
  };

  const toggleFavorite = (photo: PhotoDto) => {
    const photoId = photo.photoId.id;
    if (mode !== "edit") {
      updateGoodPicture({ photoId, goodPicture: !photo.goodPicture });
      return;
    }
    setPendingGoodPictures((previous) => {
      const current = previous[photoId] ?? photo.goodPicture;
      const others = omitKey(previous, photoId);
      return current === !photo.goodPicture
        ? others
        : { ...others, [photoId]: !current };
    });
  };

  const changeMedia = (photo: PhotoDto, mediaId: string) => {
    const photoId = photo.photoId.id;
    setPendingMedias((previous) => {
      const others = omitKey(previous, photoId);
      return mediaId === photo.media.mediaId.id
        ? others
        : { ...others, [photoId]: mediaId };
    });
  };

  const deletePhoto = (photoId: string) => {
    setDeletedPhotoIds((previous) => [...previous, photoId]);
    setPendingGoodPictures((previous) => omitKey(previous, photoId));
    setPendingMedias((previous) => omitKey(previous, photoId));
  };

  return {
    mode,
    setMode,
    rowSelection,
    setRowSelection,
    pendingGoodPictures,
    pendingMedias,
    photoPatches,
    deletedPhotoIds,
    changedCount,
    exitMode,
    toggleFavorite,
    changeMedia,
    deletePhoto,
  };
}

export type PhotoTableState = ReturnType<typeof usePhotoTableState>;
