import { createFileRoute } from "@tanstack/react-router";
import styles from "./om-oss.module.css";

export const Route = createFileRoute("/om-oss/bestilling")({
  component: OrderTab,
});

function OrderTab() {
  return (
    <div className={styles.textPage}>
      <section className={styles.textContent}>
        <h2>Fotooppdrag</h2>
        <p>
          Dersom vi har ledig kapasitet påtar vi oss eksterne fotooppdrag til en
          hyggelig pris. Vi tar de fleste typer oppdrag, ta kontakt på e-post
          til fg-salg@samfundet.no dersom du har en forespørsel.
        </p>

        <h2>Plottede bilder</h2>
        <p>
          Dersom et har seg slik at du finner et så fint bilde av deg eller en
          av dine kjære og finner deg i en situasjon hvor du vil printe et bilde
          på ekte fotopapir av skikkelig kvalitet: FRYKT IKKE! Det eneste du må
          gjøre er å sende en mail til fg-salg@samfundet.no med følgende
          opplysninger:
        </p>
        <ul>
          <li>Navn</li>
          <li>Adresse</li>
          <li>Postnummer og sted</li>
          <li>E-post</li>
          <li>Bilde</li>
          <li>Størrelse</li>
          <li>Antall</li>
          <li>Sendes per post eller hentes</li>
        </ul>

        <p>
          MERK Bestillinger som gjøres etter 15.11 om høsten og 15.04 om våren
          kan ikke garanteres levering før ferien på grunn av eksamensperiode.
        </p>

        <p>
          <b>Priser:</b>
        </p>
        <ul>
          <li>A4 (21×30) : 260,-</li>
          <li>A3 (30×42) : 320,-</li>
          <li>A2 (42×60) : 385,-</li>
          <li>A1 (60×84) : 510,-</li>
        </ul>

        <p>
          Størrelsene er veiledende. Ved spesielle formatønsker, kontakt oss på
          epost. Vi kan også levere større format enn vist i tabellen ved
          digitale utskrifter: 60cm x ubegrenset lengde. Private bilder kan
          bestilles til samme pris.
          <br />
          Alle bilder hentes i LUKA ved Søndre Side på Studentersamfundet i
          Trondhjem, eller sendes i posten, forsvarlig innpakket i harde
          papphylser, mot kr 80,- i porto og ekspedering. Leveringstid for
          bildene varierer avhengig av vår arbeidsbelastning, men man kan regne
          med ca. en måned fra betalingsdato i travle perioder.
        </p>
      </section>
    </div>
  );
}
