import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import styles from "./medium.module.css";
import { MediaDto, MediaPatchRequestDto } from "@/../generated";
import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import {
  useMedias,
  useDeleteMedia,
  useUpdateMedia,
  usePostMedia,
} from "@/hooks/media";
import ArchiveBossMediaSchema from "@/components/Arkivsjef/ArchiveBossEditMediaSchema/ArchiveBossEditMediaSchema";
import type { MediaCreateRequest } from "@/utils/api/MediaApi";
import { Button } from "@/components/ui/input/Button";
import { Plus } from "lucide-react";
import ArchiveBossCreateMedia from "@/components/Arkivsjef/ArchiveBossCreateMedia/ArchiveBossCreateMedia";

export const Route = createFileRoute("/_fgAuthenticated/fg/archiveBoss/medium")(
  {
    component: Medias,
  },
);

const sortOptions = [
  { label: "Navn A-Å", value: "nameAsc" },
  { label: "Navn Å-A", value: "nameDesc" },
];

function Medias() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [Medias, setMedias] = useState<MediaDto[]>([]);
  const [editAlbumPopUp, setEditAlbumPopUp] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMediaDialog, setNewMediaDialog] = useState(false);

  const { data, isLoading } = useMedias();
  const deleteMedia = useDeleteMedia();
  const patchMedia = useUpdateMedia();
  const postMedia = usePostMedia();

  useEffect(() => {
    setMedias(data ?? []);
  }, [data]);

  const onClose = () => {
    setEditAlbumPopUp(false);
  };

  const onCreate = (newMedia: MediaCreateRequest) => {
    postMedia.mutate(newMedia);
  };

  const onDelete = (Media: MediaDto) => {
    deleteMedia.mutate(Media.mediaId.id);
  };

  const onPatch = (Media: MediaDto) => {
    const patch_object: MediaPatchRequestDto = {
      mediaId: Media.mediaId,
      medium: Media.medium,
    };
    patchMedia.mutate(patch_object);
    onClose();
  };

  const onEdit = (Media: MediaDto) => {
    setEditAlbumPopUp(true);
    setEditingId(Media.mediaId.id);
  };
  const onNewMediaClick = () => {
    setNewMediaDialog(true);
  };
  const onCloseMediaDialog = () => {
    setNewMediaDialog(false);
  };

  const filteredAndSortedAlbums = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = Medias.filter((Media) =>
      Media.medium.toLowerCase().includes(normalizedSearch),
    );
    return filtered.toSorted((a, b) => {
      switch (sort) {
        case "nameAsc":
          return a.medium.localeCompare(b.medium);
        case "nameDesc":
          return b.medium.localeCompare(a.medium);
        default:
          return 0;
      }
    });
  }, [Medias, sort, search]);

  return (
    <div className={styles.album_page}>
      <header className={styles.pageHeader}>
        <h1> Steder </h1>
      </header>
      <div className={styles.MediaDatabase}>
        Det finnes {Medias.length} medium i databasen
      </div>
      <div className={styles.buttonDiv}>
        <Button
          size="sm"
          onClick={() => onNewMediaClick()}
          className={styles.newMediaButton}
        >
          <Plus size={16} aria-hidden="true" />
          Opprett nytt medium
        </Button>
        {newMediaDialog && (
          <ArchiveBossCreateMedia
            onClose={onCloseMediaDialog}
            onCreate={onCreate}
          />
        )}
      </div>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Sok etter steder"
          aria-label="Sok etter steder"
          className={styles.search}
        />
        <div className={styles.controls}>
          <label className={styles.sortControl}>
            <span> Sorter </span>
            <Select
              options={sortOptions}
              value={sort}
              onValueChange={setSort}
              className={styles.sortSelect}
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <p> Laster steder... </p>
      ) : (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Steder </th>
                <th> Handlinger </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedAlbums.map((Media) => (
                <ArchiveBossItem<MediaDto>
                  key={Media.mediaId.id}
                  dtoObject={Media}
                  columns={[Media.medium]}
                  editPopUp={editingId === Media.mediaId.id && editAlbumPopUp}
                  onDelete={onDelete}
                  onPatch={onPatch}
                  onClose={onClose}
                  onEdit={onEdit}
                  EditSchema={ArchiveBossMediaSchema}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
