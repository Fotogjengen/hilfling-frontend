import styles from "./RouteError.module.css";

export default function RouteError() {
  return (
    <div className={styles.container}>
      <div className={styles.error}>
        <h1>Her gikk noe galt</h1>
        <p>
          Prøv igjen senere. Om problemet ikke løser seg selv, send en epost til
          til <a href="mailto:fg-web.samfundet.no">fg-web@samfundet.no</a>.
        </p>
      </div>
    </div>
  );
}
