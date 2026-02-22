import { Link } from "react-router-dom";
import styles from "./ImagesAdvertisementPopup.module.css";
import React from "react";
import { Close } from "@mui/icons-material";
import { Button } from "@mui/material";
import GuiImageLogo from "../../gui-components/GuiImageLogo";

export type ImagesAdvertisementPopupProps = {
  onClose?: () => void;
};

export default function ImagesAdvertisementPopup({
  onClose,
}: ImagesAdvertisementPopupProps) {
  return (
    <div className={styles.OuterPopup}>
      <div className={styles.InnerPopup}>
        <GuiImageLogo size={40} className={styles.Logo} />
        <div className={styles.PopupContent}>
          <h3>Liker du bildene våre?</h3>
          <div className={styles.PopupInfo}>
            Vi printer også ut bilder i høy kvalitet.
            <Link to="/about?tab=1" className={styles.BuyLink}>
              Les mer her
            </Link>
          </div>
        </div>

        {onClose && (
          <Button
            onClick={onClose}
            className={styles.CloseButton}
            size="small"
            sx={{
              borderRadius: "999px",
              minWidth: "2rem",
              width: "2rem",
              height: "2rem",
              p: 0,
              position: "absolute",
            }}
          >
            <Close />
          </Button>
        )}
      </div>
    </div>
  );
}
