import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useMemo} from "react";

import styles from "./categories.module.css";

import { CategoryDto} from "@/../generated";

import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";

import { ScrollArea } from  "radix-ui";

import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
// import { Button } from "@/components/ui/input/Button";
import { useCategories } from '@/hooks/category';

export const Route = createFileRoute(
  '/_fgAuthenticated/fg/archiveBoss/categories',
)({
  component: Categories,
})
const sortOptions = [
  { label: "Navn A-Å", value: "nameAsc" },
  { label: "Navn Å-A", value: "nameDesc" },
];

function Categories() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [categories, setCategories] = useState<CategoryDto[]>([]);

    const {data, isLoading} = useCategories();
    
    useEffect (() => {
        setCategories(data ?? [])
      },[data])

  const filteredAndSortedAlbums = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = categories.filter((album) =>
      album.name.toLowerCase().includes(normalizedSearch));
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
  }, [categories, sort, search]);

  return (
    <div className={styles.album_page}>
        <header className={styles.pageHeader}>
        <h1>Kategori</h1>
        </header>
      <div className={styles.toolbar}>
        <SearchField 
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Sok etter kategori"
          aria-label="Sok etter kategori"
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
      <p> Laster kategorier... </p>) : (
        <div>
        <ScrollArea.Root className={styles.scrollArea}>
          <ScrollArea.Viewport className={styles.scrollAreaViewport}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Kategorier </th>
                <th> Handlinger </th>
              </tr>
            </thead>
          <tbody>

          {filteredAndSortedAlbums.map((categories, index) => (
            <ArchiveBossItem
              key={index}
              text={[categories.name]}
              category_object = {categories}
              type= "category"
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

