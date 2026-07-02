import { MouseEventHandler } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PhotoDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import styles from "./MotiveLink.module.css";

type MotiveLinkSize = "sm" | "md";

// Links to the motive a photo belongs to. "sm" is a compact title-only pill,
// "md" a card with the date the photo was taken.
export function MotiveLink({
  photo,
  size = "md",
  className,
  onClick,
}: {
  photo: PhotoDto;
  size?: MotiveLinkSize;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Button
      asChild
      variant="transparent"
      size={size}
      className={[styles.motiveLink, styles[size], className]
        .filter(Boolean)
        .join(" ")}
    >
      <Link
        to="/motive/$motiveId"
        params={{ motiveId: photo.motive.motiveId.id }}
        onClick={onClick}
      >
        {size === "sm" ? (
          photo.motive.title
        ) : (
          <span className={styles.motiveInfo}>
            <span className={styles.motiveTitle}>{photo.motive.title}</span>
            <span className={styles.motiveDate}>
              {new Date(photo.dateTaken).toLocaleDateString("nb-NO")}
            </span>
          </span>
        )}
        <ChevronRight className={styles.chevron} />
      </Link>
    </Button>
  );
}
