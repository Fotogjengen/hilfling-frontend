import { createFileRoute } from "@tanstack/react-router";
import cx from "classnames";
import styles from "./about.module.css";

export const Route = createFileRoute("/about/info")({
  component: InfoTab,
});

function InfoTab() {
  return (
    <div className={styles.twoCol}>
      <div>
        <h2>
          <b>KREDITERING</b>
        </h2>
        <p>
          Dersom du bruker bilder fra denne nettsiden skal det krediteres med
          følgende tekst:
        </p>
        <div
          className={cx(styles.cardFoto, styles.redBackground)}
          style={{ padding: "15px" }}
        >
          <p>Foto: foto.samfundet.no</p>
        </div>
        <br />
        <p>
          Ved manglende kreditering kan det bli krevet kompensasjon. For
          spørsmål rundt bruk av våre bilder og kreditering, ta kontakt med oss
          på e-posten: fg-salg@samfundet.no.
        </p>
        <br />
        <h2>
          <b>TJENESTER OG PRISER</b>
        </h2>
        <h3>BESTILLING</h3>
        <p>
          Dersom et har seg slik at du finner et så fint bilde av deg eller en
          av dine kjære og finner deg i en situasjon hvor du vil printe et bilde
          på ekte fotopapir av skikkelig kvalitet: FRYKT IKKE! Det eneste du må
          gjøre er å sende en mail til fg-salg@samfundet.no med følgende
          opplysninger:
        </p>
        <div className={cx(styles.cardFoto, styles.blueBackground)}>
          <div className={styles.listGrid}>
            <ul className={styles.noStyleList}>
              <li>Navn</li>
              <li>Addresse</li>
              <li>Postnummer og sted</li>
              <li>E-post</li>
            </ul>
            <ul className={styles.noStyleList}>
              <li>Bilde</li>
              <li>Størrelse</li>
              <li>Antall</li>
              <li>Sendes per post eller hentes</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <p>
          MERK Bestillinger som gjøres etter 15.11 om høsten og 15.04 om våren
          kan ikke garanteres levering før ferien på grunn av eksamensperiode.
        </p>
        <h3>PRISER</h3>
        <div className={cx(styles.cardFoto, styles.greenBackground)}>
          <div className={styles.listGrid}>
            <ul className={styles.noStyleList}>
              <li>A4 (21x30)</li>
              <li>A3 (30x42)</li>
              <li>A2 (42x60)</li>
              <li>A1 (60x84)</li>
            </ul>
            <ul className={styles.noStyleList}>
              <li>260,-</li>
              <li>320,-</li>
              <li>385,-</li>
              <li>510,-</li>
            </ul>
          </div>
        </div>
        <br />
        <p>
          Størrelsene er veiledende. Ved spesielle formatønsker, kontakt oss på
          epost. Vi kan også levere større format enn vist i tabellen ved
          digitale utskrifer: 60cm x ubegrenset lengde. Private bilder kan
          bestilles til samme pris.
        </p>
        <p>
          Alle bilder hentes i LUKA ved Søndre Side på Studentersamfundet i
          Trondhjem, eller sendes i posten, forsvarlig innpakket i harde
          papphylser, mot kr 80,- i porto og ekspedering. Leveringstid for
          bildene varierer avhengig av vår arbeidsbelastning, men man kan regne
          med ca. en måned fra betalingsdato i travle perioder.
        </p>
        <h2>
          <b>ANMODNING</b>
        </h2>
        <p>
          Dersom vi har ledig kapasitet påtar vi oss eksterne fotooppdrag til en
          hyggelig pris. Vi tar de fleste typer oppdrag, ta kontakt på e-post
          til fg-salg@samfundet.no dersom du har en forespørsel.
        </p>
      </div>
    </div>
  );
}
