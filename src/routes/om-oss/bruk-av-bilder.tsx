import { createFileRoute } from "@tanstack/react-router";
import styles from "./om-oss.module.css";

export const Route = createFileRoute("/om-oss/bruk-av-bilder")({
  component: UseOurPicturesTab,
});

function UseOurPicturesTab() {
  return (
    <div className={styles.textPage}>
      <section className={styles.textContent}>
        <h2>Kreditering</h2>
        <p>
          Dersom du bruker bilder fra denne nettsiden skal det krediteres med
          følgende tekst:
        </p>

        <p>
          <i>Foto: foto.samfundet.no</i>
        </p>

        <p>
          Ved manglende kreditering kan det bli krevet kompensasjon. For
          spørsmål rundt bruk av våre bilder og kreditering, ta kontakt med oss
          på e-posten: fg-salg@samfundet.no.
        </p>
      </section>
    </div>
  );
}
