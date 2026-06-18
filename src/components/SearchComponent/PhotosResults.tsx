import { usePhotosByMotiveId } from "@/hooks/photo";
import { MotiveDto } from "../../../generated";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/input/Button";
import styles from "./PhotosResults.module.css";

function formatMotiveDate(dateStr: string): string {
  const date = new Date(dateStr);
  const formatted = format(date, "EEEE d. MMMM yyyy", { locale: nb });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

type MotiveHeaderProps = {
  motive: MotiveDto;
};

function MotiveHeader({ motive }: MotiveHeaderProps) {
  const subtitleParts = [
    motive.categoryDto.name,
    motive.placeDto.name,
    formatMotiveDate(motive.date),
  ].filter(Boolean);

  return (
    <div className={styles.motiveHeader}>
      <div className={styles.motiveInfo}>
        <span className={styles.motiveTitle}>{motive.title}</span>
        <span className={styles.motiveSubtitle}>
          {subtitleParts.map((part, i) => (
            <span key={i}>{part}</span>
          ))}
        </span>
      </div>
      <Button variant="neutral" size="sm" className={styles.chevronButton}>
        <ChevronRight className={styles.chevronIcon} />
      </Button>
    </div>
  );
}

function PhotoGridSkeleton({ count }: { count: number }) {
  return (
    <div className={styles.photoGrid}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${styles.photoSkeleton} skeleton`} />
      ))}
    </div>
  );
}

function GroupSkeleton() {
  return (
    <div className={styles.group}>
      <div className={styles.motiveHeaderSkeleton}>
        <div className={styles.skeletonInfo}>
          <div className={`${styles.skeletonTitle} skeleton`} />
          <div className={`${styles.skeletonSubtitle} skeleton`} />
        </div>
        <Button
          variant="neutral"
          size="sm"
          disabled
          className={styles.chevronButton}
        >
          <ChevronRight className={styles.chevronIcon} />
        </Button>
      </div>
      <PhotoGridSkeleton count={3} />
    </div>
  );
}

type MotivePhotoGroupProps = {
  motive: MotiveDto;
};

/**
 * A single motive from the search results together with its photos. The search
 * query only returns the motives, so the actual photos are fetched here per
 * motive once it has come back.
 */
function MotivePhotoGroup({ motive }: MotivePhotoGroupProps) {
  const {
    data: photos,
    isPending,
    isError,
  } = usePhotosByMotiveId(motive.motiveId.id);
  const navigate = useNavigate({ from: "/search" });

  const openPhoto = (photoId: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        photoViewModal: {
          modalType: "searchMotive" as const,
          motiveId: motive.motiveId.id,
          photoId,
        },
      }),
      resetScroll: false,
    });
  };

  return (
    <div className={styles.group}>
      <MotiveHeader motive={motive} />
      {isPending ? (
        <PhotoGridSkeleton count={3} />
      ) : isError ? (
        <p className={styles.message}>Kunne ikke hente bilder.</p>
      ) : photos && photos.length > 0 ? (
        <div className={styles.photoGrid}>
          {photos.map((photo) => (
            <div key={photo.photoId.id} className={styles.photo}>
              <img
                src={photo.imageWeb}
                alt={`Bilde fra ${motive.title}`}
                onClick={() => openPhoto(photo.photoId.id)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PhotosResultsSkeleton() {
  return (
    <div className={styles.container}>
      {[0, 1, 2].map((i) => (
        <GroupSkeleton key={i} />
      ))}
    </div>
  );
}

type PhotosResultsProps = {
  motives: MotiveDto[];
};

export default function PhotosResults({ motives }: PhotosResultsProps) {
  return (
    <div className={styles.container}>
      {motives.map((motive) => (
        <MotivePhotoGroup key={motive.motiveId.id} motive={motive} />
      ))}
    </div>
  );
}
