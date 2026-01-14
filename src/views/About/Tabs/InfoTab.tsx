import React, { FC } from "react";

import cn from "classnames";
import styles from "../About.module.css";

import { Grid, Typography, Paper, List, ListItemText } from "@mui/material";

const InfoTab: FC = () => {
  return (
    <div>
      <Grid container spacing={4} padding={"0.5em"}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">
            <b>KREDITERING</b>
          </Typography>
          <Typography paragraph>
            Dersom du bruker bilder fra denne nettsiden skal det krediteres med
            følgende tekst:
          </Typography>
          <Paper className={cn(styles.cardFoto, styles.redBackground)}
          sx = {{padding: "15px"}}
          >
            <Typography>Foto: foto.samfundet.no</Typography>
          </Paper>
          <br />
          <Typography paragraph>
            Ved manglende kreditering kan det bli krevet kompensasjon. For
            spørsmål rundt bruk av våre bilder og kreditering, ta kontakt med
            oss på e-posten: fg-salg@samfundet.no.
          </Typography>
          <br />
          <Typography variant="h5">
            <b>TJENESTER OG PRISER</b>
          </Typography>
          <Typography variant="h6">BESTILLING</Typography>
          <Typography paragraph>
            Dersom et har seg slik at du finner et så fint bilde av deg eller en
            av dine kjære og finner deg i en situasjon hvor du vil printe et
            bilde på ekte fotopapir av skikkelig kvalitet: FRYKT IKKE! Det
            eneste du må gjøre er å sende en mail til fg-salg@samfundet.no med
            følgende opplysninger:
          </Typography>
          <Paper className={cn(styles.cardFoto, styles.blueBackground)}>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>
                <div>
                  <List>
                    <ListItemText primary="Navn" />
                    <ListItemText primary="Addresse" />
                    <ListItemText primary="Postnummer og sted" />
                    <ListItemText primary="E-post" />
                  </List>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div>
                  <List>
                    <ListItemText primary="Bilde" />
                    <ListItemText primary="Størrelse" />
                    <ListItemText primary="Antall" />
                    <ListItemText primary="Sendes per post eller hentes" />
                  </List>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography paragraph>
            MERK Bestillinger som gjøres etter 15.11 om høsten og 15.04 om våren
            kan ikke garanteres levering før ferien på grunn av eksamensperiode.
          </Typography>
          <Typography variant="h6">PRISER</Typography>
          <Paper className={cn(styles.cardFoto, styles.greenBackground)}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <div>
                  <List>
                    <ListItemText primary="A4(21x30)" />
                    <ListItemText primary="A3(30x42)" />
                    <ListItemText primary="A2(42x60)" />
                    <ListItemText primary="A1(60x84)" />
                  </List>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div>
                  <List>
                    <ListItemText primary="260,-" />
                    <ListItemText primary="320,-" />
                    <ListItemText primary="385,-" />
                    <ListItemText primary="510,-" />
                  </List>
                </div>
              </Grid>
            </Grid>
          </Paper>
          <br />
          <Typography paragraph>
            Størrelsene er veiledende. Ved spesielle formatønsker, kontakt oss
            på epost. Vi kan også levere større format enn vist i tabellen ved
            digitale utskrifer: 60cm x ubegrenset lengde. Private bilder kan
            bestilles til samme pris.
          </Typography>
          <Typography paragraph>
            Alle bilder hentes i LUKA ved Søndre Side på Studentersamfundet i
            Trondhjem, eller sendes i posten, forsvarlig innpakket i harde
            papphylser, mot kr 80,- i porto og ekspedering. Leveringstid for
            bildene varierer avhengig av vår arbeidsbelastning, men man kan
            regne med ca. en måned fra betalingsdato i travle perioder.
          </Typography>
          <Typography variant="h5">
            <b>ANMODNING</b>
          </Typography>
          <Typography paragraph>
            Dersom vi har ledig kapasitet påtar vi oss eksterne fotooppdrag til
            en hyggelig pris. Vi tar de fleste typer oppdrag, ta kontakt på
            e-post til fg-salg@samfundet.no dersom du har en forespørsel.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};
export default InfoTab;
