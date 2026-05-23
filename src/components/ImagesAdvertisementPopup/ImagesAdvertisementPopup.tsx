import styles from "./ImagesAdvertisementPopup.module.css";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ImageLogo from "../Icons/ImageLogo";

export type ImagesAdvertisementPopupProps = {
  onClose?: () => void;
};

export default function ImagesAdvertisementPopup({
  onClose,
}: ImagesAdvertisementPopupProps) {
  return (
    <div className={styles.OuterPopup}>
      <div className={styles.InnerPopup}>
        <ImageLogo size={40} className={styles.Logo} />
        <div className={styles.PopupContent}>
          <h3>Liker du bildene våre?</h3>
          <div className={styles.PopupInfo}>
            Vi printer også ut bilder i høy kvalitet.
            <Link to="/about/info" className={styles.BuyLink}>
              Les mer her
            </Link>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className={styles.CloseButton}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
