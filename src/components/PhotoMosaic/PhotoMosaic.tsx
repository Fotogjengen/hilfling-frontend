import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import styles from "./PhotoMosaic.module.css";
import { PhotoDto } from "@/../generated";
import { Photo } from "@/components/ui/display/Photo";

// Row layouts that make up the mosaic. Each kind consumes a fixed number of
// photos; rows are laid out on a 3-unit wide grid so big/small images line up.
type RowKind =
  | "bigLeft" // landscape big left, portrait right
  | "smallLeftBig" // portrait left, landscape big right
  | "twoEqual" // two landscape halves
  | "twoPortrait" // two portrait halves
  | "bigLeftStack" // landscape big left, two stacked landscapes right
  | "stackBigRight" // two stacked landscapes left, landscape big right
  | "full"; // single full-width image

const PHOTO_COUNT: Record<RowKind, number> = {
  bigLeft: 2,
  smallLeftBig: 2,
  twoEqual: 2,
  twoPortrait: 2,
  bigLeftStack: 3,
  stackBigRight: 3,
  full: 1,
};

type Orientation = "landscape" | "portrait";

// All-landscape patterns; the choice between them is varied by hash so long runs
// of landscape photos don't fall into an obvious repeating rhythm.
const LANDSCAPE_CHOICES: RowKind[] = [
  "bigLeftStack",
  "stackBigRight",
  "twoEqual",
];

// Patterns used for the skeleton placeholder rows on first load.
const SKELETON_PATTERNS: RowKind[] = [
  "bigLeftStack",
  "twoEqual",
  "stackBigRight",
  "bigLeft",
];

// Number of skeleton rows shown on first load.
const SKELETON_ROW_COUNT = 4;

// Stable hash of a string so a photo always maps to the same choice, keeping the
// layout deterministic (it doesn't reshuffle on re-render or as pages load in).
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

type Row = { kind: RowKind; photos: PhotoDto[] };

function buildRows(
  photos: PhotoDto[],
  orientations: Record<string, Orientation>,
): Row[] {
  const rows: Row[] = [];
  const orient = (photo?: PhotoDto) =>
    photo ? orientations[photo.photoId.id] : undefined;
  let i = 0;

  while (i < photos.length) {
    const remaining = photos.length - i;
    const a = orient(photos[i]);
    const b = orient(photos[i + 1]);
    const c = orient(photos[i + 2]);

    let kind: RowKind;
    if (remaining >= 2 && a === "landscape" && b === "portrait") {
      kind = "bigLeft";
    } else if (remaining >= 2 && a === "portrait" && b === "landscape") {
      kind = "smallLeftBig";
    } else if (remaining >= 2 && a === "portrait" && b === "portrait") {
      kind = "twoPortrait";
    } else if (
      remaining >= 3 &&
      a === "landscape" &&
      b === "landscape" &&
      c === "landscape"
    ) {
      kind =
        LANDSCAPE_CHOICES[
          hashString(photos[i].photoId.id) % LANDSCAPE_CHOICES.length
        ];
    } else if (remaining >= 2 && a === "landscape" && b === "landscape") {
      kind = "twoEqual";
    } else {
      // A single leftover photo (or a lone portrait at the very end).
      kind = "full";
    }

    const need = PHOTO_COUNT[kind];
    rows.push({ kind, photos: photos.slice(i, i + need) });
    i += need;
  }

  return rows;
}

// a single photo
function Tile({ photo, onPress }: { photo?: PhotoDto; onPress?: () => void }) {
  return (
    <div className={styles.tile} onClick={onPress}>
      {photo ? (
        <Photo photo={photo} className={styles.photo} />
      ) : (
        <div className={`${styles.photo} skeleton`} />
      )}
    </div>
  );
}

// a row of photos
function Row({
  kind,
  photos,
  onPhotoPress,
}: Row & { onPhotoPress?: (photo: PhotoDto) => void }) {
  const press = (photo?: PhotoDto) =>
    photo ? () => onPhotoPress?.(photo) : undefined;

  switch (kind) {
    case "bigLeftStack":
      return (
        <div className={`${styles.row} ${styles.bigLeftStack}`}>
          <Tile photo={photos[0]} onPress={press(photos[0])} />
          <div className={styles.stack}>
            <Tile photo={photos[1]} onPress={press(photos[1])} />
            <Tile photo={photos[2]} onPress={press(photos[2])} />
          </div>
        </div>
      );
    case "stackBigRight":
      return (
        <div className={`${styles.row} ${styles.stackBigRight}`}>
          <div className={styles.stack}>
            <Tile photo={photos[0]} onPress={press(photos[0])} />
            <Tile photo={photos[1]} onPress={press(photos[1])} />
          </div>
          <Tile photo={photos[2]} onPress={press(photos[2])} />
        </div>
      );
    default:
      return (
        <div className={`${styles.row} ${styles[kind]}`}>
          {Array.from({ length: PHOTO_COUNT[kind] }).map((_, i) => (
            <Tile
              key={photos[i]?.photoId.id ?? i}
              photo={photos[i]}
              onPress={press(photos[i])}
            />
          ))}
        </div>
      );
  }
}

// Loads a photo's full image to read its orientation.
function probeOrientation(
  photo: PhotoDto,
  onResult: (id: string, orientation: Orientation) => void,
) {
  const id = photo.photoId.id;
  const img = new Image();
  img.onload = () =>
    onResult(
      id,
      img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait",
    );
  img.onerror = () => onResult(id, "landscape");
  img.src = photo.imageWeb!;
}

function MosaicSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
        <Row
          key={i}
          kind={SKELETON_PATTERNS[i % SKELETON_PATTERNS.length]}
          photos={[]}
        />
      ))}
    </div>
  );
}

type PhotoMosaicProps = {
  photos: PhotoDto[];
  onPhotoPress?: (photo: PhotoDto) => void;
  // Shows skeleton rows while the photos are still being fetched.
  isLoading?: boolean;
  // Rendered at the bottom of the grid (e.g. a loading spinner and an infinite
  // scroll sentinel).
  footer?: ReactNode;
};

/**
 * Lays photos out in the mosaic grid shared by the front page and the motive
 * page. Orientations are probed by loading each image, and the layout is
 * deterministic so it doesn't reshuffle on re-render or as more photos load in.
 */
export default function PhotoMosaic({
  photos,
  onPhotoPress,
  isLoading,
  footer,
}: PhotoMosaicProps) {
  const [orientations, setOrientations] = useState<Record<string, Orientation>>(
    {},
  );
  const probed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const record = (id: string, orientation: Orientation) =>
      setOrientations((prev) => ({ ...prev, [id]: orientation }));

    photos.forEach((photo) => {
      if (probed.current.has(photo.photoId.id)) return;
      probed.current.add(photo.photoId.id);
      probeOrientation(photo, record);
    });
  }, [photos]);

  // Only reveal a contiguous prefix of photos whose orientation is known, so
  // rows are never built from a half-measured run.
  const measuredPhotos = useMemo(() => {
    let end = 0;
    while (end < photos.length && orientations[photos[end].photoId.id]) end++;
    return photos.slice(0, end);
  }, [photos, orientations]);

  const rows = useMemo(
    () => buildRows(measuredPhotos, orientations),
    [measuredPhotos, orientations],
  );

  if (isLoading || (photos.length > 0 && rows.length === 0)) {
    return <MosaicSkeleton />;
  }

  return (
    <div className={styles.grid}>
      {rows.map((row, index) => (
        <Row
          key={row.photos[0]?.photoId.id ?? index}
          {...row}
          onPhotoPress={onPhotoPress}
        />
      ))}
      {footer}
    </div>
  );
}
