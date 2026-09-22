import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useMemo} from "react";

import styles from "./categories.module.css";

import { PlaceDto} from "@/../generated";

import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";

import { ScrollArea } from  "radix-ui";

import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";

import { usePlaces } from '@/hooks/place';

export const Route = createFileRoute('/_fgAuthenticated/fg/archiveBoss/places')(
  {
    component: Places,
  },
)

const sortOptions = [
  { label: "Navn A-Å", value: "nameAsc" },
  { label: "Navn Å-A", value: "nameDesc" },
];

function Places() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [places, setPlaces] = useState<PlaceDto[]>([]);

    const {data, isLoading} = usePlaces();
    
    useEffect (() => {
        setPlaces(data ?? [])
      },[data])

  const filteredAndSortedAlbums = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = places.filter((place) =>
      place.name.toLowerCase().includes(normalizedSearch));
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
      <p> Laster steder... </p>) : (
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
            <ArchiveBossItem
              key={index}
              text={[place.name]}
              place_object = {place}
              type= "place"
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
  )
}