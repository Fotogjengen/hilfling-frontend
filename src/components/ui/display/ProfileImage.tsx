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
    <User size={size * 0.55} />
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={styles.profileImage}
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
