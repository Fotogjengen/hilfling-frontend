import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { PhotoDto } from "../../../generated";
import { EASE_OUT_EXPO } from "@/utils/animation";
import styles from "./MainPhoto.module.css";

export function MainPhotoSkeleton() {
  return <div className={`${styles.mainPhotoSkeleton} skeleton`} />;
}

// Main photo display area for desktop
export function PhotoViewMainContent({
  selectedPhoto,
  onToggleFocus,
  children,
}: {
  selectedPhoto?: PhotoDto;
  onToggleFocus: () => void;
  children?: ReactNode;
}) {
  return (
    <div
      className={styles.mainContentWrapper}
      onClick={(event) => {
        if (event.target === event.currentTarget) onToggleFocus();
      }}
    >
      {selectedPhoto ? (
        <img
          src={selectedPhoto.imageWeb}
          alt=""
          className={styles.mainPhoto}
          onClick={onToggleFocus}
        />
      ) : (
        <MainPhotoSkeleton />
      )}
      {children}
    </div>
  );
}

// Minimum drag distance before a swipe changes photo
const SWIPE_THRESHOLD = 80;

const swipeVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

// Swipeable main photo area for mobile
export function SwipeableMainPhoto({
  selectedPhoto,
  currentIndex,
  onNext,
  onPrevious,
}: {
  selectedPhoto?: PhotoDto;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  // direction of travel, so the new photo enters from the side swiped towards
  const prevIndex = useRef(currentIndex);
  const direction = currentIndex >= prevIndex.current ? 1 : -1;
  useEffect(() => {
    prevIndex.current = currentIndex;
  });

  return (
    <div className={styles.swipeViewport}>
      {selectedPhoto ? (
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={selectedPhoto.photoId.id}
            src={selectedPhoto.imageWeb}
            alt=""
            className={styles.swipePhoto}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ ease: EASE_OUT_EXPO, duration: 0.4 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x + info.velocity.x * 0.2;
              if (swipe < -SWIPE_THRESHOLD) {
                onNext();
              } else if (swipe > SWIPE_THRESHOLD) {
                onPrevious();
              }
            }}
          />
        </AnimatePresence>
      ) : (
        <MainPhotoSkeleton />
      )}
    </div>
  );
}
