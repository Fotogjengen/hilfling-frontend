import { useState } from "react";
import { User } from "lucide-react";
import styles from "./ProfileImage.module.css";

interface ProfileImageProps {
  src?: string;
  alt: string;
  size?: number;
  onClick?: () => void;
}

export function ProfileImage({
  src,
  alt,
  size = 40,
  onClick,
}: ProfileImageProps) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  const inner = showFallback ? (
    <User size={Math.round(size * 0.55)} aria-hidden="true" />
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={styles.image}
    />
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={[styles.profileImage, styles.clickable].join(" ")}
        style={{ width: size, height: size }}
        onClick={onClick}
        aria-label={alt}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={styles.profileImage} style={{ width: size, height: size }}>
      {inner}
    </div>
  );
}
