import React, { FC } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import {
  arkivsjefAlbum,
  arkivsjefKategori,
  arkivsjefMedium,
  arkivsjefSted,
} from "./mockdata";
import styles from "./Arkivsjef.module.css";
import ArchiveBossAccordion from "../../components/Arkivsjef/ArchiveBossAccordion/ArchiveBossAccordion";
import ArchiveBossOverflow from "../../components/Arkivsjef/ArchiveBossOverflow/ArchiveBossOverflow";

const ArchiveBoss: FC = () => {
  const album = arkivsjefAlbum;
  const category = arkivsjefKategori;
  const medium = arkivsjefMedium;
  const place = arkivsjefSted;

  const mapAlbums = () =>
    album.map((Album) => (
      <Grid item xs={6} sm={3} key={Album.key}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={6} sm={4}>
            <ArchiveBossOverflow />
          </Grid>
          <Grid item xs={6} sm={4} alignContent="space-around" direction="row">
            {Album.name}
          </Grid>
        </Grid>
      </Grid>
    ));

  const mapCategory = () =>
    category.map((Category) => (
      <Grid item xs={6} sm={3} key={Category.key}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={6} sm={4}>
            <ArchiveBossOverflow />
          </Grid>
          <Grid item xs={6} sm={4} alignContent="space-around" direction="row">
            {Category.name}
          </Grid>
        </Grid>
      </Grid>
    ));

  const mapPlace = () =>
    place.map((Place) => (
      <Grid item xs={6} sm={3} key={Place.key}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={6} sm={4}>
            <ArchiveBossOverflow />
          </Grid>
          <Grid item xs={6} sm={4} alignContent="space-around" direction="row">
            {Place.name}
          </Grid>
        </Grid>
      </Grid>
    ));

  const mapMedium = () =>
    medium.map((Medium) => (
      <Grid item xs={6} sm={3} key={Medium.key}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={6} sm={4}>
            <ArchiveBossOverflow />
          </Grid>
          <Grid item xs={6} sm={4} alignContent="space-around" direction="row">
            {Medium.name}
          </Grid>
        </Grid>
      </Grid>
    ));

  return (
    <div className={styles.archiveBoss}>
      <h2> Arkivsjef </h2>
      <div className={styles.description}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={2} alignContent="center" direction="row">
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <IconButton aria-label="add">
                <AddCircle className={styles.svgicon} />
              </IconButton>
              <Typography>Legg til ny</Typography>
            </Grid>
          </Grid>

          <Grid item xs={10}>
            <Typography>
              Denne siden er for fotogjengens Arkivsjef. Her kan du legge til,
              slette, eller endre Album, Kategorier, Steder eller Medium. Vær
              meget forsiktig med å forandre albumnavn dersom albumet har bilder
              liggende i seg - det ødelegger mappestrukturen til bildene.
            </Typography>
          </Grid>
        </Grid>
      </div>
      <ArchiveBossAccordion color="#da7777" name="Album">
        {mapAlbums()}
      </ArchiveBossAccordion>
      <ArchiveBossAccordion color="#f3ee78" name="Sted">
        {mapPlace()}
      </ArchiveBossAccordion>
      <ArchiveBossAccordion color="#9c77da" name="Kategori">
        {mapCategory()}
      </ArchiveBossAccordion>
      <ArchiveBossAccordion color="#7793da" name="Medium">
        {mapMedium()}
      </ArchiveBossAccordion>
    </div>
  );
};

export default ArchiveBoss;
