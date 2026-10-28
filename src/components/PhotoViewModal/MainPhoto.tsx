import { AnimatePresence, motion } from "framer-motion";
import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
  useEffect,
  useRef,
} from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { PhotoDto } from "../../../generated";
import { EASE_OUT_EXPO } from "@/utils/animation";
import styles from "./MainPhoto.module.css";

export function MainPhotoSkeleton() {
  return <div className={`${styles.mainPhotoSkeleton} skeleton`} />;
}

// Main photo display area for desktop
export function PhotoViewMainContent({
  selectedPhoto,
  showProdPicture,
  onToggleFocus,
  onToggleSidebar,
  children,
}: {
  selectedPhoto?: PhotoDto;
  showProdPicture: boolean;
  onToggleFocus: () => void;
  onToggleSidebar: () => void;
  children?: ReactNode;
}) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    didDrag.current = false;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    if (!start) return;

    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) {
      didDrag.current = true;
    }
  };

  const handleClick = () => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }

    onToggleSidebar();
  };

  return (
    <div
      className={styles.mainContentWrapper}
      onClick={(event) => {
        if (event.target === event.currentTarget) onToggleFocus();
      }}
    >
      {selectedPhoto ? (
        <div className={styles.photoTransformViewport}>
          <TransformWrapper
            key={selectedPhoto.photoId.id}
            initialScale={1}
            fitOnInit="contain"
            minScale={1}
            maxScale={5}
            wheel={{ step: 0.005 }}
            onWheelStop={(ref) => {
              if (ref.state.scale <= 1) {
                void ref.centerView(ref.state.scale, 0);
              }
            }}
            panning={{ velocityDisabled: true }}
            doubleClick={{ disabled: true }}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
              wrapperProps={{
                onPointerDown: handlePointerDown,
                onPointerMove: handlePointerMove,
                onPointerUp: () => {
                  pointerStart.current = null;
                },
                onPointerCancel: () => {
                  pointerStart.current = null;
                  didDrag.current = false;
                },
                onClick: handleClick,
              }}
            >
              <div className={styles.mainPhotoFrame}>
                <img
                  src={
                    (showProdPicture
                      ? (selectedPhoto.imageProd ?? selectedPhoto.imageWeb)
                      : selectedPhoto.imageWeb) ?? undefined
                  }
                  alt=""
                  className={styles.mainPhoto}
                  title="Scroll to zoom, drag to move"
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
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
  showProdPicture,
  currentIndex,
  onNext,
  onPrevious,
}: {
  selectedPhoto?: PhotoDto;
  showProdPicture: boolean;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const prevIndex = useRef(currentIndex);
  const direction = currentIndex >= prevIndex.current ? 1 : -1;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    prevIndex.current = currentIndex;
    touchStart.current = null;
  }, [currentIndex]);

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const offsetX = touch.clientX - start.x;
    const offsetY = touch.clientY - start.y;
    if (
      Math.abs(offsetX) < SWIPE_THRESHOLD ||
      Math.abs(offsetX) < Math.abs(offsetY)
    ) {
      return;
    }

    if (offsetX < 0) {
      onNext();
    } else {
      onPrevious();
    }
  };

  return (
    <div
      className={styles.swipeViewport}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
      }}
    >
      {selectedPhoto ? (
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={selectedPhoto.photoId.id}
            className={styles.swipePhotoFrame}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ ease: EASE_OUT_EXPO, duration: 0.4 }}
          >
            <TransformWrapper
              initialScale={1}
              fitOnInit="contain"
              minScale={1}
              maxScale={5}
              pinch={{ disabled: false, allowPanning: false }}
              panning={{ disabled: true }}
            >
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <img
                  src={
                    (showProdPicture
                      ? (selectedPhoto.imageProd ?? selectedPhoto.imageWeb)
                      : selectedPhoto.imageWeb) ?? undefined
                  }
                  alt=""
                  className={styles.swipePhoto}
                />
              </TransformComponent>
            </TransformWrapper>
          </motion.div>
        </AnimatePresence>
      ) : (
        <MainPhotoSkeleton />
      )}
    </div>
  );
}
