import { useEffect, useState } from "react";
import styles from "./archiveBoss.module.css";
import ArchiveBossAccordion from "@/components/Arkivsjef/ArchiveBossAccordion/ArchiveBossAccordion";
import { AlbumDto, PlaceDto, CategoryDto } from "@/../generated";
import { AlbumApi } from "@/utils/api/AlbumApi";
import { PlaceApi } from "@/utils/api/PlaceApi";
import { CategoryApi } from "@/utils/api/CategoryApi";
import ArchiveBossElement from "@/components/Arkivsjef/ArchiveBossElement/ArchiveBossElement";
import { ArchiveBossContext } from "@/contexts/ArchiveBossContext";
import ArchiveBossAddElements from "@/components/Arkivsjef/ArchiveBossAddElements/ArchiveBossAddElements";
import { toast } from "@/components/ui/overlay/Toaster";
import ArchiveBossCreateUsers from "@/components/Arkivsjef/ArchiveBossCreateUser/ArchiveBossCreateUsers";
import ArchiveBossOverView from "@/components/Arkivsjef/ArchiveBossOverView/ArchiveBossOverView";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/input/Button";
import { Pagination } from "@/components/ui/navigation/Pagination";

export const Route = createFileRoute("/_fgAuthenticated/fg/archiveBoss/")({
  component: ArchiveBoss,
});

function ArchiveBoss() {
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const [albumsPage, setAlbumsPage] = useState(1);
  const [placesPage, setPlacesPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);

  const [albumsTotalPages, setAlbumsTotalPages] = useState(1);
  const [placesTotalPages, setPlacesTotalPages] = useState(1);
  const [categoriesTotalPages, setCategoriesTotalPages] = useState(1);

  const [update, setUpdate] = useState(false);
  const [createUser, setCreateUser] = useState(false);
  const [overview, setOverview] = useState(false);

  const [loading, setLoading] = useState({
    albums: false,
    places: false,
    categories: false,
  });

  const itemsPerPage = 6;

  const setError = (e: string) => toast.error(e);

  const fetchAlbums = async (page: number) => {
    setLoading((prev) => ({ ...prev, albums: true }));
    try {
      const res = await AlbumApi.getAll({
        page: page - 1,
        pageSize: itemsPerPage,
      });
      setAlbums(res.data.currentList);
      setAlbumsTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading((prev) => ({ ...prev, albums: false }));
    }
  };

  const fetchPlaces = async (page: number) => {
    setLoading((prev) => ({ ...prev, places: true }));
    try {
      const res = await PlaceApi.getAll({
        page: page - 1,
        pageSize: itemsPerPage,
      });
      setPlaces(res.data.currentList);
      setPlacesTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading((prev) => ({ ...prev, places: false }));
    }
  };

  const fetchCategories = async (page: number) => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const res = await CategoryApi.getAll({
        page: page - 1,
        pageSize: itemsPerPage,
      });
      setCategories(res.data.currentList);
      setCategoriesTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  useEffect(() => {
    void fetchAlbums(1);
    void fetchPlaces(1);
    void fetchCategories(1);
  }, []);

  useEffect(() => {
    if (update) {
      void fetchAlbums(albumsPage);
      void fetchPlaces(placesPage);
      void fetchCategories(categoriesPage);
      setUpdate(false);
    }
  }, [update, albumsPage, placesPage, categoriesPage]);

  return (
    <ArchiveBossContext.Provider
      value={{
        setAlbums,
        albums,
        setCategories,
        categories,
        places,
        setPlaces,
        update,
        setUpdate,
      }}
    >
      <div className={styles.archiveBoss}>
        <h2>Arkivsjef</h2>

        <div className={styles.users}>
          <Button onClick={() => setCreateUser(true)}>Lag bruker</Button>
          {createUser && (
            <ArchiveBossCreateUsers setCreateUser={setCreateUser} />
          )}
          <Button onClick={() => setOverview(true)}>Brukere</Button>
          {overview && <ArchiveBossOverView setOverview={setOverview} />}
        </div>

        <div className={styles.description}>
          <div className={styles.descriptionInner}>
            <ArchiveBossAddElements />
            <p>
              Denne siden er for fotogjengens Arkivsjef. Her kan du legge til,
              slette, eller endre Album, Kategorier, Steder eller Medium. Vær
              meget forsiktig med å forandre albumnavn dersom albumet har bilder
              liggende i seg - det ødelegger mappestrukturen til bildene.
            </p>
          </div>
        </div>

        <ArchiveBossAccordion color="#BE3144" name="Album">
          {loading.albums ? (
            <p>Laster album...</p>
          ) : (
            <>
              <div className={styles.grid}>
                {albums.map((album, index) => (
                  <ArchiveBossElement
                    key={index}
                    text={album.name}
                    id={album.albumId.id}
                    type="album"
                  />
                ))}
              </div>
              <div className={styles.pagination}>
                <Pagination
                  currentPage={albumsPage}
                  totalPages={albumsTotalPages}
                  onPageChange={(page) => {
                    setAlbumsPage(page);
                    void fetchAlbums(page);
                  }}
                />
              </div>
            </>
          )}
        </ArchiveBossAccordion>

        <ArchiveBossAccordion color="#8F4650" name="Sted">
          {loading.places ? (
            <p>Laster steder...</p>
          ) : (
            <>
              <div className={styles.grid}>
                {places.map((place, index) => (
                  <ArchiveBossElement
                    key={index}
                    text={place.name}
                    id={place.placeId.id}
                    type="place"
                  />
                ))}
              </div>
              <div className={styles.pagination}>
                <Pagination
                  currentPage={placesPage}
                  totalPages={placesTotalPages}
                  onPageChange={(page) => {
                    setPlacesPage(page);
                    void fetchPlaces(page);
                  }}
                />
              </div>
            </>
          )}
        </ArchiveBossAccordion>

        <ArchiveBossAccordion color="#605C5C" name="Kategori">
          {loading.categories ? (
            <p>Laster kategorier...</p>
          ) : (
            <>
              <div className={styles.grid}>
                {categories.map((category, index) => (
                  <ArchiveBossElement
                    key={index}
                    text={category.name}
                    id={category.categoryId.id}
                    type="category"
                  />
                ))}
              </div>
              <div className={styles.pagination}>
                <Pagination
                  currentPage={categoriesPage}
                  totalPages={categoriesTotalPages}
                  onPageChange={(page) => {
                    setCategoriesPage(page);
                    void fetchCategories(page);
                  }}
                />
              </div>
            </>
          )}
        </ArchiveBossAccordion>
      </div>
    </ArchiveBossContext.Provider>
  );
}
