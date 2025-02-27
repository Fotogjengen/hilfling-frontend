import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./Arkivsjef.module.css";
import ArchiveBossAccordion from "../../../components/Arkivsjef/ArchiveBossAccordion/ArchiveBossAccordion";
import { Button, Grid, Typography } from "@mui/material";
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

const ArchiveBoss: FC = () => {
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [update, setUpdate] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [createUser, setCreateUser] = useState(false);
  const [overview, setOverview] = useState(false);

  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  const setError = (e: string) => {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage(e);
  };

  useEffect(() => {
    AlbumApi.getAll()
      .then((res) => setAlbums(res.data.currentList))
      .catch((e) => {
        setError(e);
      });
    PlaceApi.getAll()
      .then((res) => setPlaces(res.data.currentList))
      .catch((e) => {
        setError(e);
      });
    CategoryApi.getAll()
      .then((res) => setCategories(res.data.currentList))
      .catch((e) => {
        setError(e);
      });
  }, []);

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
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={2} alignContent="center">
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  className={styles.addNewButton}
                >
                  <ArchiveBossAddElements />
                </Grid>
              </Grid>
              <Grid item xs={10}>
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

          <ArchiveBossAccordion color="#da7777" name="Album">
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
          </ArchiveBossAccordion>
          <ArchiveBossAccordion color="#f3ee78" name="Sted">
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
          <ArchiveBossAccordion color="#9c77da" name="Kategori">
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
