import { animate } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { GOOD_PHOTOS_PAGE_SIZE, useFlatGoodPhotos } from "@/hooks/photo";
import { PhotoDto } from "../../../../generated";
import { usePageLoadSentinels } from "./PhotoViewSidebar";
import { EASE_OUT_EXPO } from "@/utils/animation";
import styles from "./PhotoViewModal.module.css";

// Skeleton thumbnails shown while the initial photos load.
const INITIAL_SKELETON_COUNT = 8;
// Skeleton thumbnails shown while an adjacent page is fetching.
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
  selectedPhoto,
  initialPage,
  onSelectPhoto,
}: {
  selectedPhoto?: PhotoDto;
  initialPage: number;
  onSelectPhoto: (photo: PhotoDto) => void;
}) {
  const {
    data: goodPhotos,
    photos,
    ...pagination
  } = useFlatGoodPhotos(initialPage);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const didInitialCenter = useRef(false);
  const animation = useRef<ReturnType<typeof animate>>();
  const animationStart = useRef(0);

  // center the selected thumbnail — instantly on first selection, animated
  // afterwards. The size morph shifts layout while we scroll, so recompute
  // the target every frame (same approach as the sidebar).
  useEffect(() => {
    if (!selectedPhoto) return;
    const container = containerRef.current;
    const item = itemRefs.current.get(selectedPhoto.photoId.id);
    if (!container || !item) return;
    const targetLeft = () =>
      item.offsetLeft - (container.clientWidth - item.offsetWidth) / 2;
    if (!didInitialCenter.current) {
      didInitialCenter.current = true;
      container.scrollLeft = targetLeft();
    }
    animationStart.current = container.scrollLeft;
    animation.current?.stop();
    animation.current = animate(0, 1, {
      ease: EASE_OUT_EXPO,
      duration: 0.4,
      onUpdate: (progress) => {
        const start = animationStart.current;
        container.scrollLeft = start + (targetLeft() - start) * progress;
      },
    });
    return () => animation.current?.stop();
  }, [selectedPhoto]);

  // shifts both the scroll position and any in-flight centering animation,
  // for when content is inserted to the left of the viewport
  const shiftScrollBy = (delta: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollLeft += delta;
    animationStart.current += delta;
  };

  // keep the scroll position stable when previous pages are prepended
  const prevFirstLoadedPage = useRef(goodPhotos?.pages[0]?.page);
  useLayoutEffect(() => {
    const firstLoadedPage = goodPhotos?.pages[0]?.page;
    const container = containerRef.current;
    if (
      container &&
      firstLoadedPage !== undefined &&
      prevFirstLoadedPage.current !== undefined &&
      firstLoadedPage < prevFirstLoadedPage.current
    ) {
      const prependedCount =
        (prevFirstLoadedPage.current - firstLoadedPage) * GOOD_PHOTOS_PAGE_SIZE;
      const first = itemRefs.current.get(photos[0]?.photoId.id);
      const second = itemRefs.current.get(photos[1]?.photoId.id);
      if (first && second) {
        // stride includes the flex gap between items
        shiftScrollBy(prependedCount * (second.offsetLeft - first.offsetLeft));
      }
    }
    prevFirstLoadedPage.current = firstLoadedPage;
  });

  // keep the scroll position stable as the left loading skeletons mount and
  // unmount, mirroring the page-prepend compensation above
  const leftLoaderRef = useRef<HTMLDivElement>(null);
  const prevLoaderWidth = useRef(0);
  useLayoutEffect(() => {
    const width = leftLoaderRef.current?.offsetWidth ?? 0;
    if (width !== prevLoaderWidth.current && containerRef.current) {
      shiftScrollBy(width - prevLoaderWidth.current);
      prevLoaderWidth.current = width;
    }
  });

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
