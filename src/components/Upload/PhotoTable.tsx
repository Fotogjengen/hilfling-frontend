import { useMemo } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Table,
} from "@tanstack/react-table";
import { Star, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { MediaDto, PhotoDto } from "../../../generated";
import { DataTable } from "../ui/display/DataTable";
import { Button } from "../ui/input/Button";
import { Checkbox } from "../ui/input/Checkbox";
import { IconButton } from "../ui/input/IconButton";
import { Select } from "../ui/input/Select";
import { useMedias } from "@/hooks/media";
import { useDeletePhoto } from "@/hooks/photo";
import { PhotoTableState } from "./usePhotoTableState";
import { confirmDialog } from "../ui/overlay/ConfirmDialog";
import styles from "./PhotoTable.module.css";

type PhotoTableProps = {
  photos: PhotoDto[];
  motiveId: string;
  tableState: PhotoTableState;
  onOpenPhoto: (photoId: string) => void;
};

function getFileName(photo: PhotoDto) {
  const lastSegment = photo.imageThumb.split("?")[0].split("/").pop();
  return lastSegment ? decodeURIComponent(lastSegment) : "-";
}

function getHeaderCheckedState(table: Table<PhotoDto>) {
  if (table.getIsAllRowsSelected()) return true;
  return table.getIsSomeRowsSelected() ? "indeterminate" : false;
}

function FavoriteStar({ isFavorite }: { isFavorite: boolean }) {
  return (
    <Star
      size={20}
      className={isFavorite ? styles.filledStar : undefined}
      aria-hidden="true"
    />
  );
}

export default function PhotoTable({
  photos,
  motiveId,
  tableState,
  onOpenPhoto,
}: PhotoTableProps) {
  const {
    mode,
    rowSelection,
    setRowSelection,
    pendingGoodPictures,
    pendingMedias,
    deletedPhotoIds,
    toggleFavorite,
    changeMedia,
    deletePhoto,
  } = tableState;

  const { mutate: removePhoto } = useDeletePhoto(motiveId);
  const { data: medias = [] } = useMedias();
  const mediaGroups = useMemo(() => {
    const toOption = (media: MediaDto) => ({
      label: media.medium,
      value: media.mediaId.id,
    });
    return [
      {
        label: "Digital",
        options: medias.filter((media) => !media.analog).map(toOption),
      },
      {
        label: "Analog",
        options: medias.filter((media) => media.analog).map(toOption),
      },
    ].filter((group) => group.options.length > 0);
  }, [medias]);

  const visiblePhotos = useMemo(
    () => photos.filter((photo) => !deletedPhotoIds.includes(photo.photoId.id)),
    [photos, deletedPhotoIds],
  );

  const columns = useMemo<ColumnDef<PhotoDto>[]>(
    () => [
      ...(mode === "select"
        ? [
            {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  aria-label="Velg alle bilder"
                  checked={getHeaderCheckedState(table)}
                  onCheckedChange={(checked) =>
                    table.toggleAllRowsSelected(checked === true)
                  }
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  aria-label="Velg bilde"
                  checked={row.getIsSelected()}
                  onCheckedChange={(checked) =>
                    row.toggleSelected(checked === true)
                  }
                />
              ),
            } satisfies ColumnDef<PhotoDto>,
          ]
        : []),
      {
        id: "photo",
        header: "Foto",
        cell: ({ row }) => (
          <img
            className={styles.thumbnail}
            src={row.original.imageThumb}
            alt="Opplastet bilde"
            onClick={() => onOpenPhoto(row.original.photoId.id)}
          />
        ),
      },
      {
        id: "name",
        accessorFn: getFileName,
        header: "Navn",
      },
      {
        id: "dateUploaded",
        accessorFn: (photo) => photo.dateUploaded,
        header: "Opplastet",
        cell: ({ row }) =>
          format(parseISO(row.original.dateUploaded), "dd.MM.yyyy"),
      },
      {
        id: "medium",
        accessorFn: (photo) => photo.media.medium,
        header: "Medium",
        cell: ({ row }) =>
          mode === "edit" ? (
            <Select
              ariaLabel="Medium"
              groups={mediaGroups}
              value={
                pendingMedias[row.original.photoId.id] ??
                row.original.media.mediaId.id
              }
              onValueChange={(mediaId) => changeMedia(row.original, mediaId)}
            />
          ) : (
            row.original.media.medium
          ),
      },
      {
        id: "favorite",
        accessorFn: (photo) => photo.goodPicture,
        header: "Favoritt",
        cell: ({ row }) => {
          const photo = row.original;
          const isFavorite =
            pendingGoodPictures[photo.photoId.id] ?? photo.goodPicture;
          return mode === "edit" ? (
            <IconButton
              aria-label="Marker som god"
              variant="neutral"
              size="sm"
              onClick={() => toggleFavorite(photo)}
            >
              <FavoriteStar isFavorite={isFavorite} />
            </IconButton>
          ) : (
            <FavoriteStar isFavorite={isFavorite} />
          );
        },
      },
      {
        id: "delete",
        cell: ({ row }) => (
          <Button
            variant="subtle-danger"
            size="sm"
            onClick={() =>
              confirmDialog.error("Slett bilde?", {
                  description: "Bildet slettes permanent. Dette kan ikke angres.",
                  confirmLabel: "Slett",
                  onConfirm: () =>
                    mode === "edit"
                      ? deletePhoto(row.original.photoId.id)
                      : removePhoto(row.original.photoId.id)
              })
            }
          >
            <Trash2 size={16} aria-hidden="true" />
            Slett
          </Button>
        ),
      },
    ],
    [
      mode,
      pendingGoodPictures,
      pendingMedias,
      mediaGroups,
      onOpenPhoto,
      removePhoto,
    ],
  );

  const table = useReactTable({
    data: visiblePhotos,
    columns,
    getRowId: (photo) => photo.photoId.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable
      table={table}
      borderless
      columnClassNames={{
        select: { header: styles.selectCell, cell: styles.selectCell },
        name: { cell: styles.secondaryCell },
        dateUploaded: { cell: styles.secondaryCell },
        medium: { cell: styles.secondaryCell },
      }}
    />
  );
}
