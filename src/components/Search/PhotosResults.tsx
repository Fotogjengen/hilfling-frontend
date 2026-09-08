import { useDeferredValue } from "react";
import { usePhotosByMotiveId } from "@/hooks/photo";
import { MotiveDto } from "../../../generated";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/input/Button";
import { Photo } from "@/components/ui/display/Photo";
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
  const { navigate } = useRouter();
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
      <Button
        variant="neutral"
        size="sm"
        className={styles.chevronButton}
        onClick={() =>
          void navigate({
            to: "/motive/$motiveId",
            params: {
              motiveId: motive.motiveId.id,
            },
          })
        }
      >
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
      <div className={styles.motiveHeader}>
        <div className={styles.motiveInfo}>
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

function MotivePhotoGroup({ motive }: MotivePhotoGroupProps) {
  const {
    data: photos,
    isPending,
    isError,
  } = usePhotosByMotiveId(motive.motiveId.id);
  const navigate = useNavigate({ from: "/search" });

  // deffer photos so that we dont immediatly paint 200 imgs when loading the page
  const deferredPhotos = useDeferredValue(photos ?? []);

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
      ) : deferredPhotos.length > 0 ? (
        <div className={styles.photoGrid}>
          {deferredPhotos.map((photo) => (
            <div key={photo.photoId.id} className={styles.photo}>
              <Photo
                photo={photo}
                alt={`Bilde fra ${motive.title}`}
                onClick={() => openPhoto(photo.photoId.id)}
              />
            </div>
          ))}
        </div>
      ) : photos && photos.length === 0 ? null : (
        <PhotoGridSkeleton count={3} />
      )}
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
