import styles from "./NotFound.module.css";
import image from "./404.png";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.notFound}>
        <img src={image} alt="404" />
        <p>
          Shoot! Her gikk noe galt... Denne siden ser ikke ut til å eksistere.
          Hvis det er noe du mener er feil kan du sende en mail til{" "}
          <a href="mailto:fotogjengen@samfundet.no">fotogjengen@samfundet.no</a>
          {". Forsiden finner du "}
          <a href="https://foto.samfundet.no/">her</a>.
        </p>
      </div>
    </div>
  );
}
