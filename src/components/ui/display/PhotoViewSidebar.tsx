import { animate, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { GOOD_PHOTOS_PAGE_SIZE, useFlatGoodPhotos } from "@/hooks/photo";
import { PhotoDto } from "../../../../generated";
import { EASE_OUT_EXPO } from "@/utils/animation";
import styles from "./PhotoViewModal.module.css";

type ContainerRef = { current: HTMLDivElement | null };
type ItemRefMap = { current: Map<string, HTMLDivElement> };

/**
 * Scrolls the selected photo to the center of the sidebar — instantly on the
 * first selection, animated afterwards. Returns a callback that shifts both
 * the scroll position and any in-flight animation, for when content is
 * inserted above the viewport.
 */
function useCenterSelectedPhoto(
  containerRef: ContainerRef,
  itemRefs: ItemRefMap,
  selectedPhoto?: PhotoDto,
) {
  const didInitialCenter = useRef(false);
  const animation = useRef<ReturnType<typeof animate>>();
  const animationStart = useRef(0);

  useEffect(() => {
    if (!selectedPhoto) return;
    const container = containerRef.current;
    const item = itemRefs.current.get(selectedPhoto.photoId.id);
    if (!container || !item) return;
    // the size morph shifts layout while we scroll, so recompute the target
    // every frame and interpolate towards it — both end up settled together
    const targetTop = () =>
      item.offsetTop - (container.clientHeight - item.offsetHeight) / 2;
    if (!didInitialCenter.current) {
      didInitialCenter.current = true;
      container.scrollTop = targetTop();
    }
    animationStart.current = container.scrollTop;
    animation.current?.stop();
    animation.current = animate(0, 1, {
      ease: EASE_OUT_EXPO,
      duration: 0.4,
      onUpdate: (progress) => {
        const start = animationStart.current;
        container.scrollTop = start + (targetTop() - start) * progress;
      },
    });
    return () => animation.current?.stop();
  }, [selectedPhoto, containerRef, itemRefs]);

  return (delta: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop += delta;
    animationStart.current += delta;
  };
}

/**
 * Keeps the scroll position stable when previous pages are prepended.
 * Prepended items are never selected, so they all share the same height.
 */
function usePrependScrollCompensation(
  itemRefs: ItemRefMap,
  photos: PhotoDto[],
  firstLoadedPage: number | undefined,
  shiftScrollBy: (delta: number) => void,
) {
  const prevFirstLoadedPage = useRef(firstLoadedPage);
  useLayoutEffect(() => {
    if (
      firstLoadedPage !== undefined &&
      prevFirstLoadedPage.current !== undefined &&
      firstLoadedPage < prevFirstLoadedPage.current
    ) {
      const prependedCount =
        (prevFirstLoadedPage.current - firstLoadedPage) * GOOD_PHOTOS_PAGE_SIZE;
      const firstItem = itemRefs.current.get(photos[0]?.photoId.id);
      if (firstItem) {
        shiftScrollBy(prependedCount * firstItem.offsetHeight);
      }
    }
    prevFirstLoadedPage.current = firstLoadedPage;
  }, [photos, firstLoadedPage, itemRefs, shiftScrollBy]);
}

/**
 * Fetches the next/previous page when the sentinel elements approach the
 * viewport. Returns the refs to attach to the sentinels.
 */
function usePageLoadSentinels(
  containerRef: ContainerRef,
  enabled: boolean,
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFetchingNextPage: boolean;
    isFetchingPreviousPage: boolean;
    fetchNextPage: () => Promise<unknown>;
    fetchPreviousPage: () => Promise<unknown>;
  },
) {
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const {
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = pagination;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (
            entry.target === topSentinelRef.current &&
            hasPreviousPage &&
            !isFetchingPreviousPage
          ) {
            void fetchPreviousPage();
          }
          if (
            entry.target === bottomSentinelRef.current &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            void fetchNextPage();
          }
        }
      },
      { root: container, rootMargin: "400px" },
    );
    if (topSentinelRef.current) observer.observe(topSentinelRef.current);
    if (bottomSentinelRef.current) observer.observe(bottomSentinelRef.current);
    return () => observer.disconnect();
  }, [
    containerRef,
    enabled,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  ]);

  return { topSentinelRef, bottomSentinelRef };
}

export function PhotoViewSidebar({
  selectedPhoto,
  initialPage,
  onSelectPhoto,
  isFocused,
}: {
  selectedPhoto?: PhotoDto;
  initialPage: number;
  onSelectPhoto: (photo: PhotoDto) => void;
  isFocused: boolean;
}) {
  const {
    data: goodPhotos,
    photos,
    ...pagination
  } = useFlatGoodPhotos(initialPage);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const shiftScrollBy = useCenterSelectedPhoto(
    containerRef,
    itemRefs,
    selectedPhoto,
  );
  usePrependScrollCompensation(
    itemRefs,
    photos,
    goodPhotos?.pages[0]?.page,
    shiftScrollBy,
  );
  const { topSentinelRef, bottomSentinelRef } = usePageLoadSentinels(
    containerRef,
    photos.length > 0,
    pagination,
  );

  return (
    <motion.div
      className={styles.photoViewSidebarBackground}
      animate={{
        x: isFocused ? "-100%" : "0%",
        marginRight: isFocused ? "-20%" : "0%",
      }}
      transition={{ ease: EASE_OUT_EXPO, duration: 0.4 }}
    >
      {photos.length > 0 && (
        <div ref={containerRef} className={styles.photoViewSidebarList}>
          <div ref={topSentinelRef} className={styles.sidebarSpacer} />
          {photos.map((photo) => (
            <div
              key={photo.photoId.id}
              className={styles.sidebarItem}
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
                className={`${styles.sidebarPhoto} ${photo.photoId.id === selectedPhoto?.photoId.id ? styles.selectedSidebarPhoto : ""}`}
              />
            </div>
          ))}
          <div ref={bottomSentinelRef} className={styles.sidebarSpacer} />
        </div>
      )}
    </motion.div>
  );
}
