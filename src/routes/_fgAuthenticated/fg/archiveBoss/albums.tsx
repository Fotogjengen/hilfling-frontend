import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from "react";

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
  { label: "Nyeste først", value: "newest" },
  { label: "Eldste først", value: "oldest" },
  { label: "Navn A-AA", value: "nameAsc" },
];


function AlbumsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [albumsPage, setAlbumsPage] = useState(1);
  // const [albumsTotalPages, setAlbumsTotalPages] = useState(1);

  const [update, setUpdate] = useState(false);

  const [loading, setLoading] = useState({
    albums: false,
    places: false,
    categories: false,});

  const itemsPerPage = 20;
  const setError = (e: string) => toast.error(e);

  // const { data, isLoading, isError } = useAlbums();

  // const albumsList = data?.currentList ?? [];
  
  const fetchAlbums = async (page: number) => {
    setLoading((prev) => ({ ...prev, albums: true }));
    try {
      const res = await AlbumApi.getAll({
        page: page - 1,
        // pageSize: itemsPerPage,
      });
      setAlbums(res.data.currentList);
      // setAlbumsTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading((prev) => ({ ...prev, albums: false }));
    }
  };
  useEffect(() => {
    void fetchAlbums(1);
  }, []);
  useEffect(() => {
    if (update) {
      void fetchAlbums(albumsPage);
      setUpdate(false);
    }
  }, [update, albumsPage]);

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
          {/* <Button variant="neutral" size="sm" className={styles.iconTextButton}>
            <Filter size={16} aria-hidden="true" />
            Filter
          </Button> */}
          <label className={styles.sortControl}>
            <span>Sorter</span>
            <Select
              options={sortOptions}
              value={sort}
              onValueChange={setSort}
              className={styles.sortSelect}
            />
          </label>
        </div>
      </div>

    {loading.albums ? (
      <p>Laster album...</p>) : (
        <div >
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Album </th>
                <th>Handlinger</th>
              </tr>
            </thead>
          <tbody>

          {albums.map((album, index) => (
           
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
