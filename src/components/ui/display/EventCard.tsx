import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useGoodPhotosByMotiveId, usePhotosByMotiveId } from "@/hooks/photo";
import styles from "./EventCard.module.css";
import { MotiveDto, PhotoDto } from "../../../../generated";
import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

type EventCardProps = {
  motive: MotiveDto;
  size?: "large" | "full";
};

const MAX_PHOTOS = 4;

type Shape = "Standing" | "Laying";
type Orientation = Shape | "Full";
type Measurement = Shape | "Failed";
type Placement = { photo: PhotoDto; orientation?: Orientation };

function pickPhotos(photos: PhotoDto[], limit: number) {
  const shuffled = photos
    .filter((photo) => photo.imageWeb)
    .sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

function arrange(measured: { photo: PhotoDto; shape: Shape }[]): Placement[] {
  const photos = measured.map((m) => m.photo);
  const standing = measured
    .filter((m) => m.shape === "Standing")
    .map((m) => m.photo);
  const laying = measured
    .filter((m) => m.shape === "Laying")
    .map((m) => m.photo);
  const place = (list: PhotoDto[], orientation: Orientation) =>
    list.map((photo) => ({ photo, orientation }));

  if (photos.length === 0) return [];

  if (photos.length === 1) return place(photos, "Full");

  if (photos.length === 2) return place(photos, "Standing");

  if (standing.length >= 3 || (standing.length === 2 && laying.length === 1)) {
    return place(standing.slice(0, 2), "Standing");
  }

  if (laying.length === 4) return place(laying, "Laying");

  const tall = standing[0] ?? laying[0];
  const wide = place(
    laying.filter((photo) => photo !== tall).slice(0, 2),
    "Laying",
  );
  const [tallPlacement] = place([tall], "Standing");

  return Math.random() < 0.5
    ? [tallPlacement, ...wide]
    : [wide[0], tallPlacement, wide[1]];
}

export default function EventCard({ motive, size = "large" }: EventCardProps) {
  const {
    data: goodPictures,
    isPending,
    isError,
  } = useGoodPhotosByMotiveId(motive.motiveId.id);

  const hasNoGoodPictures = goodPictures?.length === 0;
  const { data: allPictures, isLoading: isFallbackLoading } =
    usePhotosByMotiveId(motive.motiveId.id, hasNoGoodPictures);

  const photos = useMemo(
    () =>
      hasNoGoodPictures
        ? pickPhotos(allPictures ?? [], 1)
        : pickPhotos(goodPictures ?? [], MAX_PHOTOS),
    [hasNoGoodPictures, allPictures, goodPictures],
  );
  const { navigate } = useRouter();

  const [measurements, setMeasurements] = useState<Record<string, Measurement>>(
    {},
  );

  const record = (id: string, measurement: Measurement) => {
    setMeasurements((prev) =>
      id in prev ? prev : { ...prev, [id]: measurement },
    );
  };

  const settled = photos.every((photo) => photo.photoId.id in measurements);

  const placements = useMemo<Placement[]>(() => {
    if (!settled) return photos.map((photo) => ({ photo }));

    return arrange(
      photos.flatMap((photo) => {
        const shape = measurements[photo.photoId.id];
        return shape === "Failed" ? [] : [{ photo, shape }];
      }),
    );
  }, [photos, measurements, settled]);

  if (isPending || isFallbackLoading) {
    return <EventCardSkeleton size={size} />;
  }

  if (isError) {
    return <div>Kunne ikke hente bilder.</div>;
  }

  return (
    <div
      className={`${styles.wrapper} ${styles[size]}`}
      onClick={() =>
        void navigate({
          to: "/motive/$motiveId",
          params: {
            motiveId: motive.motiveId.id,
          },
        })
      }
    >
      <div className={styles.photoGridWrapper}>
        {settled && placements.length === 0 && (
          <div className={styles.photoPlaceholder}>
            <ImageOff className={styles.placeholderIcon} />
          </div>
        )}
        <div className={`${styles.photoGrid}`}>
          {placements.map(({ photo, orientation }) => (
            <div
              key={photo.photoId.id}
              className={`${styles.photo} ${orientation ? styles[orientation] : styles.hidePhoto}`}
            >
              <img
                src={photo.imageWeb}
                alt={`Bilde fra ${motive.title}`}
                onLoad={(e) => {
                  record(
                    photo.photoId.id,
                    e.currentTarget.naturalWidth > e.currentTarget.naturalHeight
                      ? "Laying"
                      : "Standing",
                  );
                }}
                onError={() => {
                  record(photo.photoId.id, "Failed");
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.title}>{motive.title}</span>
        <span className={styles.date}>
          {format(new Date(motive.date), "d. MMMM", { locale: nb })}
        </span>
      </div>
    </div>
  );
}

export function EventCardSkeleton({ size }: { size: EventCardProps["size"] }) {
  return (
    <div className={`${styles.wrapper} ${styles[size!]}`}>
      <div className={`${styles.skeletonPhoto} skeleton`} />
      <div className={styles.skeletonFooter}>
        <div className={`${styles.skeletonTitle} skeleton`} />
        <div className={`${styles.skeletonDate} skeleton`} />
      </div>
    </div>
  );
}
