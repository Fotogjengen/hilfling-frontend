import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MotiveDto } from "@/../generated";
import { usePhotosByMotiveId } from "@/hooks/photo";
import PhotoMosaic from "@/components/PhotoMosaic/PhotoMosaic";
import styles from "./motive.module.css";

export const Route = createFileRoute("/motive/$motiveId")({
  component: MotivePage,
});

function formatMotiveDate(dateStr: string): string {
  const formatted = format(new Date(dateStr), "EEEE d. MMMM yyyy", {
    locale: nb,
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function MotiveHeader({ motive }: { motive: MotiveDto }) {
  const subtitleParts = [
    motive.categoryDto.name,
    motive.placeDto.name,
    formatMotiveDate(motive.date),
  ].filter(Boolean);

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{motive.title}</h1>
      <div className={styles.subtitle}>
        {subtitleParts.map((part, i) => (
          <span key={i}>{part}</span>
        ))}
      </div>
    </div>
  );
}

function MotiveHeaderSkeleton() {
  return (
    <div className={styles.header}>
      <div className={`${styles.titleSkeleton} skeleton`} />
      <div className={`${styles.subtitleSkeleton} skeleton`} />
    </div>
  );
}

function MotivePage() {
  const { motiveId } = Route.useParams();
  const navigate = useNavigate({ from: "/motive/$motiveId" });
  const { data: photos, isPending, isError } = usePhotosByMotiveId(motiveId);

  const motive = photos?.[0]?.motive;

  const openPhoto = (photoId: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        photoViewModal: {
          modalType: "searchMotive" as const,
          motiveId,
          photoId,
        },
      }),
      resetScroll: false,
    });
  };

  return (
    <div className={styles.page}>
      {motive ? (
        <MotiveHeader motive={motive} />
      ) : isPending ? (
        <MotiveHeaderSkeleton />
      ) : null}

      {isError ? (
        <p className={styles.message}>Kunne ikke hente bilder.</p>
      ) : !isPending && (!photos || photos.length === 0) ? (
        <p className={styles.message}>Fant ingen bilder.</p>
      ) : (
        <PhotoMosaic
          photos={photos ?? []}
          isLoading={isPending}
          onPhotoPress={(photo) => openPhoto(photo.photoId.id)}
          hideMotiveLink
        />
      )}
    </div>
  );
}

export default MotivePage;
