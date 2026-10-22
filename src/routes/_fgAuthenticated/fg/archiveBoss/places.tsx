import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import styles from "./places.module.css";
import { PlaceDto, PlacePatchRequestDto } from "@/../generated";
import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import { ScrollArea } from "radix-ui";
import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import { usePlaces, useDeletePlace, useUpdatePlace } from "@/hooks/place";
import ArchiveBossEditPlaceSchema from "@/components/Arkivsjef/ArchiveBossEditPlaceSchema/ArchiveBossEditPlaceSchema";


export const Route = createFileRoute("/_fgAuthenticated/fg/archiveBoss/places")(
  {
    component: Places,
  },
);

const sortOptions = [
  { label: "Navn A-Å", value: "nameAsc" },
  { label: "Navn Å-A", value: "nameDesc" },
];

function Places() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [editAlbumPopUp, setEditAlbumPopUp] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = usePlaces();
  const deletePlace = useDeletePlace();
  const patchPlace = useUpdatePlace();

  useEffect(() => {
    setPlaces(data ?? []);
  }, [data]);

  const onClose = () =>{
    setEditAlbumPopUp(false)
  };

  const onDelete = (place : PlaceDto) => {
    deletePlace.mutate(place.placeId.id);
  };

  const onPatch = (place: PlaceDto) => {
    const patch_object: PlacePatchRequestDto = {
      placeId: place.placeId,
      name: place.name,
    };
    patchPlace.mutate(patch_object);
    onClose();
  };



  const onEdit = (place: PlaceDto) => {
    setEditAlbumPopUp(true)
    setEditingId(place.placeId.id)
  };

  const filteredAndSortedAlbums = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = places.filter((place) =>
      place.name.toLowerCase().includes(normalizedSearch),
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
  }, [places, sort, search]);

  return (
    <div className={styles.album_page}>
      <header className={styles.pageHeader}>
        <h1> Steder </h1>
      </header>
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
          <ScrollArea.Root className={styles.scrollArea}>
            <ScrollArea.Viewport className={styles.scrollAreaViewport}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th> Steder </th>
                    <th> Handlinger </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedAlbums.map((place, index) => (
                    <ArchiveBossItem<PlaceDto>
                      key={place.placeId.id}
                      Type = 'place'
                      dtoObject={place}
                      columns={[place.name]}
                      editPopUp ={(editingId === place.placeId.id) && editAlbumPopUp}
                      onDelete={onDelete}
                      onPatch={onPatch}
                      onClose={onClose}
                      onEdit={onEdit}
                      EditSchema={ArchiveBossEditPlaceSchema}
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
