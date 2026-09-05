import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useMemo} from "react";

import styles from "./albums.module.css";

import { toast } from "@/components/ui/overlay/Toaster";

import { AlbumDto} from "@/../generated";
import { AlbumApi } from "@/utils/api/AlbumApi";

import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import { Pagination } from "@/components/ui/navigation/Pagination";

import { ScrollArea } from  "radix-ui";

import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import { Button } from "@/components/ui/input/Button";
import { useAlbums } from '@/hooks/album';


export const Route = createFileRoute('/_fgAuthenticated/fg/archiveBoss/albums')(
  {
    component: AlbumsPage,
  },
)

const sortOptions = [
  // { label: "Nyeste først", value: "newest" },
  // { label: "Eldste først", value: "oldest" },
  { label: "Navn A-Å", value: "nameAsc" },
  { label: "Navn Å-A", value: "nameDesc" },
];


function AlbumsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [sortedAlbums, setSortedAlbums] = useState<AlbumDto[]>([])


  // const [albumsPage, setAlbumsPage] = useState(1);


  // const [update, setUpdate] = useState(false);

  const itemsPerPage = 20;

  const {
    data,
    isLoading,
    isError,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
    } = useAlbums();
    
    useEffect (() => {
      setAlbums(data ?? [])
    },[data])

const filteredAndSortedAlbums = useMemo(() => {
  const normalizedSearch = search.trim().toLowerCase();

  // First filter
  const filtered = albums.filter((album) =>
    album.name.toLowerCase().includes(normalizedSearch)
  );

  // Then sort
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
      <p> Laster album... </p>) : (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Album </th>
                <th> Handlinger </th>
              </tr>
            </thead>
          <tbody>

          {filteredAndSortedAlbums.map((album, index) => (
            <ArchiveBossItem
              key={index}
              text={album.name}
              id={album.albumId.id}
              type="album"
            />
            
          ))}
          </tbody>
          </table>
        </div>
          )}
    </div>
  )}
