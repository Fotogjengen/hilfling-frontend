import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { useGoodPhotosByMotiveId } from "@/hooks/photo";
import styles from "./EventCard.module.css";
import { MotiveDto, PhotoDto } from "../../../../generated";
import { useEffect, useMemo, useState } from "react";

type EventCardProps = {
  motive: MotiveDto;
};

const MAX_PHOTOS = 4;

type Orientation = "Standing" | "Laying" | "Full";

function pickPhotos(photos: PhotoDto[]) {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, MAX_PHOTOS);
}

export default function EventCard({ motive }: EventCardProps) {
  const {
    data: goodPictures,
    isPending,
    isError,
  } = useGoodPhotosByMotiveId(motive.motiveId.id);

  const photos = useMemo(() => pickPhotos(goodPictures ?? []), [goodPictures]);

  const [orientations, setOrientations] = useState<Record<string, Orientation>>(
    {},
  );

  const sortedPhotos = useMemo(() => {
    const order = Object.keys(orientations);
    if (order.length === 0) return photos;
    // Render photos in the order their ids were inserted into `orientations`;
    // hidden photos (not in the map) go last.
    const rank = (id: string) => {
      const idx = order.indexOf(id);
      return idx === -1 ? Infinity : idx;
    };
    return [...photos].sort((a, b) => rank(a.photoId.id) - rank(b.photoId.id));
  }, [photos, orientations]);

  const handleLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    id: string,
  ) => {
    const orientation: Orientation =
      e.currentTarget.naturalWidth > e.currentTarget.naturalHeight
        ? "Laying"
        : "Standing";

    setLoadedImages((prev) => {
      if (prev.some((p) => p.id === id)) return prev;
      return [...prev, { orientation, id }];
    });
  };

  const [loadedImages, setLoadedImages] = useState<
    {
      orientation: Orientation;
      id: string;
    }[]
  >([]);

  useEffect(() => {
    if (loadedImages.length < Math.min(MAX_PHOTOS, photos.length)) return;

    const standing = loadedImages.filter((i) => i.orientation === "Standing");
    const laying = loadedImages.filter((i) => i.orientation === "Laying");

    if (loadedImages.length === 1) {
      // one picture, pretend its laying (full)
      setOrientations({ [loadedImages[0].id]: "Full" });
      return;
    }

    if (loadedImages.length === 2) {
      // Two pictures, pretend both of them are standing
      setOrientations({
        [loadedImages[0].id]: "Standing",
        [loadedImages[1].id]: "Standing",
      });
      return;
    }

    if (standing.length > 2) {
      // Two standing pictures next to each other (3x4)
      setOrientations({
        [standing[0].id]: "Standing",
        [standing[1].id]: "Standing",
      });
      return;
    }

    if (standing.length === 2 && laying.length === 1) {
      // Two standing pictures next to each other (3x4)
      setOrientations({
        [standing[0].id]: "Standing",
        [standing[1].id]: "Standing",
      });
      return;
    }

    if (
      (standing.length === 2 && laying.length === 2) ||
      (standing.length === 1 && laying.length >= 2)
    ) {
      // One standing picture, two laying
      setOrientations(
        Math.random() < 0.5
          ? {
              [standing[0].id]: "Standing",
              [laying[0].id]: "Laying",
              [laying[1].id]: "Laying",
            }
          : {
              [laying[0].id]: "Laying",
              [standing[0].id]: "Standing",
              [laying[1].id]: "Laying",
            },
      );
      return;
    }

    if (laying.length === 4) {
      setOrientations({
        [laying[0].id]: "Laying",
        [laying[1].id]: "Laying",
        [laying[2].id]: "Laying",
        [laying[3].id]: "Laying",
      });

      return;
    }

    console.error(
      `Eventcard layout case not accounted for! Standing: ${standing.length} Laying: ${laying.length}`,
    );
  }, [loadedImages, photos]);

  if (isPending) {
    return <EventCardSkeleton />;
  }

  if (isError) {
    return <div>Kunne ikke hente bilder.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.photoGridWrapper}>
        <div className={`${styles.photoGrid}`}>
          {sortedPhotos.map((photo) => (
            <div
              key={photo.photoId.id}
              className={`${styles.photo} ${orientations[photo.photoId.id] ? styles[orientations[photo.photoId.id]] : styles.hidePhoto}`}
            >
              <img
                src={photo.imageWeb}
                alt={`Bilde fra ${motive.title}`}
                onLoad={(e) => {
                  handleLoad(e, photo.photoId.id);
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

export function EventCardSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.skeletonPhoto} skeleton`} />
      <div className={styles.skeletonFooter}>
        <div className={`${styles.skeletonTitle} skeleton`} />
        <div className={`${styles.skeletonDate} skeleton`} />
      </div>
    </div>
  );
}
