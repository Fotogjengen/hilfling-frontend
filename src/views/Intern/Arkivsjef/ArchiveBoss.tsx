import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./Arkivsjef.module.css";
import ArchiveBossAccordion from "../../../components/Arkivsjef/ArchiveBossAccordion/ArchiveBossAccordion";
import { Box, Button, Grid, Pagination, Typography } from "@mui/material";
import { AlbumDto, PlaceDto, CategoryDto } from "../../../../generated";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { PlaceApi } from "../../../utils/api/PlaceApi";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import ArchiveBossElement from "../../../components/Arkivsjef/ArchiveBossElement/ArchiveBossElement";
import { ArchiveBossContext } from "../../../contexts/ArchiveBossContext";
import ArchiveBossAddElements from "../../../components/Arkivsjef/ArchiveBossAddElements/ArchiveBossAddElements";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import ArchiveBossCreateUsers from "../../../components/Arkivsjef/ArchiveBossCreateUser/ArchiveBossCreateUsers";
import ArchiveBossOverView from "../../../components/Arkivsjef/ArchiveBossOverView/ArchiveBossOverView";

interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
}

const ArchiveBoss: FC = () => {
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

  const [loading, setLoading] = useState<{
    albums: boolean;
    places: boolean;
    categories: boolean;
  }>({
    albums: false,
    places: false,
    categories: false,
  });

  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);
  const itemsPerPage = 6;

  const setError = (e: string) => {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage(e);
  };

  const fetchAlbums = async (page: number) => {
    setLoading((prev) => ({ ...prev, albums: true }));
    await AlbumApi.getAll({
      page: page - 1,
      pageSize: itemsPerPage,
    })
      .then((res) => {
        setAlbums(res.data.currentList);
        setAlbumsTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        setError(err as string);
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, albums: false }));
      });
  };

  // const fetchPlaces = async (page: number) => {
  //   setLoading((prev) => ({ ...prev, places: true }));
  //   try {
  //     const res = await PlaceApi.getAll({
  //       page: page - 1,
  //       pageSize: itemsPerPage,
  //     });

  //     setPlaces(res.data.currentList);
  //     setPlacesTotalPages(res.data.totalPages);
  //   } catch (e) {
  //     setError(e as string);
  //   } finally {
  //     setLoading((prev) => ({ ...prev, places: false }));
  //   }
  // };

  // const fetchCategories = async (page: number) => {
  //   setLoading((prev) => ({ ...prev, categories: true }));
  //   try {
  //     const res = await CategoryApi.getAll({
  //       page: page - 1,
  //       pageSize: itemsPerPage,
  //     });

  //     setCategories(res.data.currentList);
  //     setCategoriesTotalPages(res.data.totalPages);
  //   } catch (e) {
  //     setError(e as string);
  //   } finally {
  //     setLoading((prev) => ({ ...prev, categories: false }));
  //   }
  // };

  const handleAlbumsPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setAlbumsPage(value);
    void fetchAlbums(value);
  };

  const handlePlacesPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPlacesPage(value);
    // fetchPlaces(value);
  };

  const handleCategoriesPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCategoriesPage(value);
    // fetchCategories(value);
  };

  useEffect(() => {
    void fetchAlbums(1);
    // fetchPlaces(1);
    // fetchCategories(1);
  }, []);

  useEffect(() => {
    if (update) {
      void fetchAlbums(albumsPage);
      // fetchPlaces(placesPage);
      // fetchCategories(categoriesPage);
      setUpdate(false);
    }
  }, [update, albumsPage, placesPage, categoriesPage]);

  // useEffect(() => {
  //   AlbumApi.getAll({ page: 0, pageSize: 2 })
  //     .then((res) => {
  //       setAlbums(res.data.currentList);
  //     })
  //     .catch((e) => {
  //       setError(e);
  //     });
  //   PlaceApi.getAll()
  //     .then((res) => setPlaces(res.data.currentList))
  //     .catch((e) => {
  //       setError(e);
  //     });
  //   CategoryApi.getAll()
  //     .then((res) => setCategories(res.data.currentList))
  //     .catch((e) => {
  //       setError(e);
  //     });
  // }, []);

  return (
    <>
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
          <h2> Arkivsjef </h2>

          <div className={styles.users}>
            <Button onClick={() => setCreateUser(true)}>Lag bruker</Button>
            {createUser && (
              <ArchiveBossCreateUsers setCreateUser={setCreateUser} />
            )}
            <Button onClick={() => setOverview(true)}>Brukere</Button>
            {overview && <ArchiveBossOverView setOverview={setOverview} />}
          </div>

          <div className={styles.description}>
            <Grid
              container
              direction="row"
              display="flex"
              justifyContent="start"
              alignItems="center"
              spacing={"2rem"}
              flexWrap="wrap"
              padding={"1rem"}
            >
              <Grid item xs={12} sm={4} md="auto">
                <ArchiveBossAddElements />
              </Grid>

              <Grid item xs={12} sm={9}>
                <Typography>
                  Denne siden er for fotogjengens Arkivsjef. Her kan du legge
                  til, slette, eller endre Album, Kategorier, Steder eller
                  Medium. Vær meget forsiktig med å forandre albumnavn dersom
                  albumet har bilder liggende i seg - det ødelegger
                  mappestrukturen til bildene.
                </Typography>
              </Grid>
            </Grid>
          </div>

          <ArchiveBossAccordion color="#BE3144" name="Album">
            {loading.albums ? (
              <Typography>Laster albums...</Typography>
            ) : (
              <>
                <Grid container spacing={2}>
                  {albums.map((album: AlbumDto, index: number) => (
                    <Grid item key={index} xs={12} sm={4}>
                      <ArchiveBossElement
                        text={album.title}
                        id={album.albumId.id}
                        key={index}
                        type="album"
                      />
                    </Grid>
                  ))}
                </Grid>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={albumsTotalPages}
                    page={albumsPage}
                    onChange={handleAlbumsPageChange}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </ArchiveBossAccordion>
          <ArchiveBossAccordion color="#8F4650" name="Sted">
            {" "}
            {/*#605C5C*/} {/*#7C3640*/}
            <Grid container spacing={2}>
              {places.map((place: PlaceDto, index: number) => (
                <Grid item key={index} xs={12} sm={4}>
                  <ArchiveBossElement
                    text={place.name}
                    id={place.placeId.id}
                    type="place"
                    key={index}
                  />
                </Grid>
              ))}
            </Grid>
          </ArchiveBossAccordion>
          <ArchiveBossAccordion color="#605C5C" name="Kategori">
            {" "}
            {/*#3A3B3C*/}
            <Grid container spacing={2}>
              {categories.map((category: CategoryDto, index: number) => (
                <Grid item key={index} xs={12} sm={4}>
                  <ArchiveBossElement
                    text={category.name}
                    id={category.categoryId.id}
                    type="category"
                    key={index}
                  />
                </Grid>
              ))}
            </Grid>
          </ArchiveBossAccordion>
        </div>
      </ArchiveBossContext.Provider>
    </>
  );
};

export default ArchiveBoss;
