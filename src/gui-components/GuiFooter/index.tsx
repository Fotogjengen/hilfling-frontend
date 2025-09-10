import React, { FC } from "react";
import styles from "./GuiFooter.module.css";
import Instagram from "../../../src/gui-components/Guiicons/Instagram";

const GuiFooter: FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.section}>
          <h2>HILFLING</h2>
          <p>
            Velkommen til Hilfling. Hilfling er fotogjengen sin nettside. Siden
            er open source, så om du er interessert i å vite hvordan siden
            fungerer, eller ønsker å rapportere bugs må du gjerne gjøre det her.
          </p>

          <a
            href="https://github.com/Fotogjengen/hilfling-frontend/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#ad2f33" }}
          >
            HILFLING-FRONTEND
          </a>
          <br />
          <a
            href="https://github.com/Fotogjengen/hilfling-photo-backend"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#ad2f33" }}
          >
            HILFLING-PHOTO-BACKEND
          </a>
        </div>
        <div className={styles.section}>
          <h2>FØLG OSS </h2>

          <div>
            <a
              href="https://www.instagram.com/fotogjengen/"
              className={styles.follow}
            >
              <Instagram />
              <p className={styles.media}>Instagram</p>
            </a>
          </div>
        </div>
        <div className={styles.section}>
          <h2>FOTOGJENGEN</h2>
          <p>
            Fotogjengen er en gjeng ved Studentersamfundet i Trondhjem. Vi har
            som oppgave å ta bilder av alt som skjer på Samfundet, under UKA og
            under ISFiT. Vi består av 15 funksjonærer. På denne siden finner du
            informasjon om oss og hvilke tjenester vi tilbyr.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuiFooter;
