import { animate } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { GOOD_PHOTOS_PAGE_SIZE } from "@/hooks/photo";
import { PhotoDto } from "../../../generated";
import { EASE_OUT_EXPO } from "@/utils/animation";

export type ContainerRef = { current: HTMLDivElement | null };
export type ItemRefMap = { current: Map<string, HTMLDivElement> };

export type ScrollAxis = "vertical" | "horizontal";

/**
 * The slice of an infinite query the gallery thumbnails need. A non-paginated
 * source (e.g. a single motive's photos) can pass an all-false object, which
 * turns the prepend/sentinel machinery into no-ops.
 */
export type GalleryPagination = {
  isPending: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  fetchPreviousPage: () => Promise<unknown>;
};

const AXIS_PROPS = {
  vertical: {
    scroll: "scrollTop",
    offsetStart: "offsetTop",
    offsetSize: "offsetHeight",
    clientSize: "clientHeight",
  },
  horizontal: {
    scroll: "scrollLeft",
    offsetStart: "offsetLeft",
    offsetSize: "offsetWidth",
    clientSize: "clientWidth",
  },
} as const;

/**
 * Scrolls the selected photo to the center of the container (instantly on
 * the first selection, animated afterwards). Returns a callback that shifts
 * both the scroll position and any in-flight animation, for when content is
 * inserted before the viewport.
 */
export function useCenterSelectedPhoto(
  containerRef: ContainerRef,
  itemRefs: ItemRefMap,
  axis: ScrollAxis,
  selectedPhoto?: PhotoDto,
) {
  const { scroll, offsetStart, offsetSize, clientSize } = AXIS_PROPS[axis];
  const didInitialCenter = useRef(false);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const animationStart = useRef(0);

  useEffect(() => {
    if (!selectedPhoto) return;
    const container = containerRef.current;
    const item = itemRefs.current.get(selectedPhoto.photoId.id);
    if (!container || !item) return;
    // the size morph shifts layout while we scroll, so recompute the target
    // every frame and interpolate towards it.
    const target = () =>
      item[offsetStart] - (container[clientSize] - item[offsetSize]) / 2;
    if (!didInitialCenter.current) {
      didInitialCenter.current = true;
      container[scroll] = target();
    }
    animationStart.current = container[scroll];
    animation.current?.stop();
    animation.current = animate(0, 1, {
      ease: EASE_OUT_EXPO,
      duration: 0.4,
      onUpdate: (progress) => {
        const start = animationStart.current;
        container[scroll] = start + (target() - start) * progress;
      },
    });
    return () => animation.current?.stop();
  }, [
    selectedPhoto,
    containerRef,
    itemRefs,
    scroll,
    offsetStart,
    offsetSize,
    clientSize,
  ]);

  return (delta: number) => {
    const container = containerRef.current;
    if (!container) return;
    container[scroll] += delta;
    animationStart.current += delta;
  };
}

/**
 * Keeps the scroll position stable when previous pages are prepended.
 * Prepended items are never selected, so they all share the same stride
 * (item size plus the flex gap, measured from the first two items).
 */
export function usePrependScrollCompensation(
  itemRefs: ItemRefMap,
  axis: ScrollAxis,
  photos: PhotoDto[],
  firstLoadedPage: number | undefined,
  shiftScrollBy: (delta: number) => void,
) {
  const { offsetStart, offsetSize } = AXIS_PROPS[axis];
  const prevFirstLoadedPage = useRef(firstLoadedPage);
  useLayoutEffect(() => {
    if (
      firstLoadedPage !== undefined &&
      prevFirstLoadedPage.current !== undefined &&
      firstLoadedPage < prevFirstLoadedPage.current
    ) {
      const prependedCount =
        (prevFirstLoadedPage.current - firstLoadedPage) * GOOD_PHOTOS_PAGE_SIZE;
      const first = itemRefs.current.get(photos[0]?.photoId.id);
      const second = itemRefs.current.get(photos[1]?.photoId.id);
      if (first) {
        const stride = second
          ? second[offsetStart] - first[offsetStart]
          : first[offsetSize];
        shiftScrollBy(prependedCount * stride);
      }
    }
    prevFirstLoadedPage.current = firstLoadedPage;
  }, [
    photos,
    firstLoadedPage,
    itemRefs,
    shiftScrollBy,
    offsetStart,
    offsetSize,
  ]);
}

/**
 * Keeps the scroll position stable as the leading loading skeletons mount
 * and unmount, mirroring what `usePrependScrollCompensation` does for real
 * items.
 */
export function useLoaderScrollCompensation(
  loaderRef: ContainerRef,
  axis: ScrollAxis,
  shiftScrollBy: (delta: number) => void,
) {
  const { offsetSize } = AXIS_PROPS[axis];
  const prevSize = useRef(0);
  useLayoutEffect(() => {
    const size = loaderRef.current?.[offsetSize] ?? 0;
    if (size !== prevSize.current) {
      shiftScrollBy(size - prevSize.current);
      prevSize.current = size;
    }
  });
}

/**
 * Fetches the next/previous page when the sentinel elements approach the
 * viewport. Returns the refs to attach to the sentinels.
 */
export function usePageLoadSentinels(
  containerRef: ContainerRef,
  enabled: boolean,
  pagination: GalleryPagination,
) {
  const {
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = pagination;

  const { ref: topSentinelRef, inView: topInView } = useInView({
    root: containerRef.current,
    rootMargin: "400px",
    skip: !enabled,
  });
  const { ref: bottomSentinelRef, inView: bottomInView } = useInView({
    root: containerRef.current,
    rootMargin: "400px",
    skip: !enabled,
  });

  useEffect(() => {
    if (topInView && hasPreviousPage && !isFetchingPreviousPage) {
      void fetchPreviousPage();
    }
  }, [topInView, hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage]);

  useEffect(() => {
    if (bottomInView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [bottomInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { topSentinelRef, bottomSentinelRef };
}
