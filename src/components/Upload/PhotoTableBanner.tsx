import { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "../ui/input/IconButton";
import styles from "./PhotoTableBanner.module.css";

type PhotoTableBannerProps = {
  message: string;
  onClose: () => void;
  children?: ReactNode;
};

export default function PhotoTableBanner({
  message,
  onClose,
  children,
}: PhotoTableBannerProps) {
  return (
    <div className={styles.banner}>
      <span>{message}</span>
      <div className={styles.actions}>
        {children}
        <IconButton
          aria-label="Avslutt"
          variant="subtle"
          size="sm"
          onClick={onClose}
        >
          <X size={20} />
        </IconButton>
      </div>
    </div>
  );
}
