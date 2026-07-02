import { useRef } from "react";
import { PhotoDto } from "../../../generated";
import {
  GalleryPagination,
  useCenterSelectedPhoto,
  useLoaderScrollCompensation,
  usePageLoadSentinels,
  usePrependScrollCompensation,
} from "./scrollHooks";
import styles from "./PhotoViewBottomStrip.module.css";

const INITIAL_SKELETON_COUNT = 8;
const PAGE_SKELETON_COUNT = 3;

function StripSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${styles.stripSkeleton} skeleton`} />
      ))}
    </>
  );
}

/** Horizontal thumbnail strip shown below the main photo on mobile. */
export function PhotoViewBottomStrip({
  photos,
  pagination,
  firstLoadedPage,
  selectedPhoto,
  onSelectPhoto,
}: {
  photos: PhotoDto[];
  pagination: GalleryPagination;
  firstLoadedPage: number | undefined;
  selectedPhoto?: PhotoDto;
  onSelectPhoto: (photo: PhotoDto) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftLoaderRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const shiftScrollBy = useCenterSelectedPhoto(
    containerRef,
    itemRefs,
    "horizontal",
    selectedPhoto,
  );
  usePrependScrollCompensation(
    itemRefs,
    "horizontal",
    photos,
    firstLoadedPage,
    shiftScrollBy,
  );
  useLoaderScrollCompensation(leftLoaderRef, "horizontal", shiftScrollBy);
  const { topSentinelRef, bottomSentinelRef } = usePageLoadSentinels(
    containerRef,
    photos.length > 0,
    pagination,
  );

  if (pagination.isPending) {
    return (
      <div className={styles.bottomStrip}>
        <StripSkeletons count={INITIAL_SKELETON_COUNT} />
      </div>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.bottomStrip}>
      <div ref={topSentinelRef} className={styles.stripSentinel} />
      <div ref={leftLoaderRef} className={styles.stripLoader}>
        {pagination.isFetchingPreviousPage && (
          <StripSkeletons count={PAGE_SKELETON_COUNT} />
        )}
      </div>
      {photos.map((photo) => (
        <div
          key={photo.photoId.id}
          className={styles.stripItem}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(photo.photoId.id, el);
            } else {
              itemRefs.current.delete(photo.photoId.id);
            }
          }}
        >
          <img
            onClick={() => onSelectPhoto(photo)}
            src={photo.imageWeb}
            alt=""
            loading="lazy"
            decoding="async"
            className={`${styles.stripPhoto} ${photo.photoId.id === selectedPhoto?.photoId.id ? styles.selectedStripPhoto : ""}`}
          />
        </div>
      ))}
      {pagination.isFetchingNextPage && (
        <StripSkeletons count={PAGE_SKELETON_COUNT} />
      )}
      <div ref={bottomSentinelRef} className={styles.stripSentinel} />
    </div>
  );
}
