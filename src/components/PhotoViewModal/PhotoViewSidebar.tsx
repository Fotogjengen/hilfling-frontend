import { motion } from "framer-motion";
import { useRef } from "react";
import { PhotoDto } from "../../../generated";
import { EASE_OUT_EXPO } from "@/utils/animation";
import {
  GalleryPagination,
  useCenterSelectedPhoto,
  useLoaderScrollCompensation,
  usePageLoadSentinels,
  usePrependScrollCompensation,
} from "./scrollHooks";
import styles from "./PhotoViewModal.module.css";

// Skeleton thumbnails shown while the initial photos load
const INITIAL_SKELETON_COUNT = 10;
// Skeleton thumbnails shown while an adjacent page is fetching
const PAGE_SKELETON_COUNT = 4;

function SidebarSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.sidebarItem}>
          <div className={`${styles.sidebarSkeleton} skeleton`} />
        </div>
      ))}
    </>
  );
}

export function PhotoViewSidebar({
  photos,
  pagination,
  firstLoadedPage,
  selectedPhoto,
  onSelectPhoto,
  isFocused,
}: {
  photos: PhotoDto[];
  pagination: GalleryPagination;
  firstLoadedPage: number | undefined;
  selectedPhoto?: PhotoDto;
  onSelectPhoto: (photo: PhotoDto) => void;
  isFocused: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topLoaderRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const shiftScrollBy = useCenterSelectedPhoto(
    containerRef,
    itemRefs,
    "vertical",
    selectedPhoto,
  );
  usePrependScrollCompensation(
    itemRefs,
    "vertical",
    photos,
    firstLoadedPage,
    shiftScrollBy,
  );
  useLoaderScrollCompensation(topLoaderRef, "vertical", shiftScrollBy);
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
      {pagination.isPending && (
        <div className={styles.photoViewSidebarList}>
          <div className={styles.sidebarSpacer} />
          <SidebarSkeletons count={INITIAL_SKELETON_COUNT} />
        </div>
      )}
      {photos.length > 0 && (
        <div ref={containerRef} className={styles.photoViewSidebarList}>
          <div ref={topSentinelRef} className={styles.sidebarSpacer} />
          <div ref={topLoaderRef}>
            {pagination.isFetchingPreviousPage && (
              <SidebarSkeletons count={PAGE_SKELETON_COUNT} />
            )}
          </div>
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
          {pagination.isFetchingNextPage && (
            <SidebarSkeletons count={PAGE_SKELETON_COUNT} />
          )}
          <div ref={bottomSentinelRef} className={styles.sidebarSpacer} />
        </div>
      )}
    </motion.div>
  );
}
