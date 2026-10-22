import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import styles from "./albums.module.css";
import { AlbumDto,AlbumPatchRequestDto } from "@/../generated";
import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import { ScrollArea } from "radix-ui";
import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import { useAlbums, useDeleteAlbum,useUpdateAlbum } from "@/hooks/album";
import ArchiveBossAlbumSchema from "@/components/Arkivsjef/ArchiveBossEditAlbumSchema/ArchiveBossEditAlbumSchema";

export const Route = createFileRoute("/_fgAuthenticated/fg/archiveBoss/albums")(
  {
    component: AlbumsPage,
  },
);

const sortOptions = [
  { label: "Navn A-Å", value: "nameAsc" },
  { label: "Navn Å-A", value: "nameDesc" },
];

function AlbumsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [editAlbumPopUp, setEditAlbumPopUp] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {data, isLoading } = useAlbums();
  const deleteAlbum = useDeleteAlbum();
  const patchAlbum = useUpdateAlbum();

  useEffect(() => {
    setAlbums(data ?? []);
  }, [data]);
  useEffect(() => {
    console.log("changed to:", editAlbumPopUp);
  }, [editAlbumPopUp]);

  const onDelete = (album : AlbumDto) => {
    deleteAlbum.mutate(album.albumId.id);
  };

  const onPatch = (album: AlbumDto) => {
    const patch_object: AlbumPatchRequestDto = {
      albumId: album.albumId,
      name: album.name,
      description: album.description,
      analog: album.analog,
      isDefault: album.isDefault,
    };
    patchAlbum.mutate(patch_object);
    onClose();
  };

  const onClose = () =>{
    setEditAlbumPopUp(false)
  };

  const onEdit = (album: AlbumDto) => {
    setEditAlbumPopUp(true)
    setEditingId(album.albumId.id)
  };
  const filteredAndSortedAlbums = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = albums.filter((album) =>
      album.name.toLowerCase().includes(normalizedSearch),
    );
    return filtered.toSorted((a, b) => {
      switch (sort) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [albums, sort, search]);

  return (
    <div className={styles.album_page}>
      <header className={styles.pageHeader}>
        <h1>Album</h1>
      </header>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Sok etter albumnavn"
          aria-label="Sok etter albumnavn"
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
        <p> Laster album... </p>
      ) : (
        <div>
          <ScrollArea.Root className={styles.scrollArea}>
            <ScrollArea.Viewport className={styles.scrollAreaViewport}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th> Album </th>
                    <th> Beskrivelse </th>
                    <th> Handlinger </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedAlbums.map((album, index) => (
                    <ArchiveBossItem<AlbumDto>
                      key={album.albumId.id}
                      Type = 'album'
                      dtoObject={album}
                      columns={[album.name, album.description]}
                      editPopUp ={(editingId === album.albumId.id) && editAlbumPopUp}
                      onDelete={onDelete}
                      onPatch={onPatch}
                      onClose={onClose}
                      onEdit={onEdit}
                      EditSchema={ArchiveBossAlbumSchema}
                    />
                  ))}
                </tbody>
              </table>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      )}
    </div>
  );
}
