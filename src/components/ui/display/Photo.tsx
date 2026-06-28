import { ImgHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Download } from "lucide-react";
import { PhotoDto } from "@/../generated";
import { usePhotoDownload } from "@/hooks/photoDownload";
import { IconButton } from "@/components/ui/input/IconButton";
import { Button } from "@/components/ui/input/Button";
import styles from "./Photo.module.css";

type PhotoQuality = "thumb" | "web" | "full";

interface PhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  photo: PhotoDto;
  quality?: PhotoQuality;
  hideMotiveLink?: boolean;
}

function srcFor(photo: PhotoDto, quality: PhotoQuality): string | undefined {
  switch (quality) {
    case "thumb":
      return photo.imageThumb;
    case "full":
      return photo.imageProd;
    default:
      return photo.imageWeb;
  }
}

export function Photo({
  photo,
  quality = "web",
  hideMotiveLink,
  alt,
  className,
  ...rest
}: PhotoProps) {
  const { requestDownload, creditPopUp } = usePhotoDownload();

  return (
    <div className={styles.wrapper}>
      <img
        src={srcFor(photo, quality)}
        alt={alt ?? photo.motive.title}
        className={className ? `${styles.photo} ${className}` : styles.photo}
        {...rest}
      />
      <div className={styles.overlay}>
        <IconButton
          aria-label="Last ned bilde"
          variant="transparent"
          onClick={(e) => {
            e.stopPropagation();
            requestDownload(photo);
          }}
        >
          <Download />
        </IconButton>
        {!hideMotiveLink && (
          <Button
            asChild
            variant="transparent"
            size="sm"
            className={styles.motivePill}
          >
            <Link
              to="/motive/$motiveId"
              params={{ motiveId: photo.motive.motiveId.id }}
              onClick={(e) => e.stopPropagation()}
            >
              {photo.motive.title}
              <ChevronRight className={styles.motivePillIcon} />
            </Link>
          </Button>
        )}
      </div>
      {creditPopUp && (
        <div className={styles.creditPopUp} onClick={(e) => e.stopPropagation()}>
          {creditPopUp}
        </div>
      )}
    </div>
  );
}
