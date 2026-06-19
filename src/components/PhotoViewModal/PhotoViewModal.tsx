import { PhotoViewModalOptions } from "@/types";
import { Dialog } from "radix-ui";
import styles from "./PhotoViewModal.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/input/IconButton";
import { Check, Download, Info, Link, PanelLeft, X } from "lucide-react";
import {
  useFlatGoodPhotos,
  useGoodPhotoPlacement,
  useInfiniteMotivePhotos,
} from "@/hooks/photo";
import { PhotoDto } from "../../../generated";
import { useRouter } from "@tanstack/react-router";
import { useCopyToClipboard } from "@/hooks/clipboard";
import { usePhotoDownload } from "@/hooks/photoDownload";
import { useArrowKeyNavigation } from "@/hooks/arrowKeyNavigation";
import { useInactivity } from "@/hooks/useInactivity";
import { PhotoViewSidebar } from "./PhotoViewSidebar";
import { PhotoViewBottomStrip } from "./PhotoViewBottomStrip";
import { GalleryPagination } from "./scrollHooks";
import { hasUserInteracted } from "@/utils/userInteraction";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_OUT_EXPO } from "@/utils/animation";
import { toast } from "../ui/overlay/Toaster";
import { isAxiosError } from "axios";

type Props = {
  options: PhotoViewModalOptions;
  onClose: () => void;
};

function PhotoModalWrapper({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  // skip the fade-in when the modal mounts as part of the initial page load
  const [animateIn] = useState(hasUserInteracted);

  //hide scrollbar
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, []);

  return (
    <Dialog.Root open modal={false} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <div
          className={`${styles.dialogOverlay} ${animateIn ? styles.fadeInAnimation : ""}`}
        />
        <Dialog.Content
          className={`${styles.dialogContent} ${animateIn ? styles.fadeInAnimation : ""}`}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <Dialog.Title hidden>Bilder</Dialog.Title>
          <Dialog.Description hidden>Bilder</Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function checkAndDisplayLoadingError(error?: Error | null) {
  if (!error || !isAxiosError(error)) {
    return false;
  }

  const resStatus = error.response?.status;

  // unauthenticated/does not have access
  if (resStatus === 401 || resStatus === 403) {
    toast.error("Kunne ikke hente bildet", {
      description: "Du har ikke tilgang til å se dette bildet.",
    });
    return true;
  }

  // not found
  if (resStatus === 404) {
    toast.error("Kunne ikke hente bildet", {
      description:
        "Fant ikke bildet. Det kan ha blitt slettet, eller du kan ha fått en lenke som ikke fungerer.",
    });
    return true;
  }

  // bad request, most likely a broken link
  if (resStatus === 400) {
    toast.error("Kunne ikke hente bildet", {
      description: "Du har en lenke som ikke fungerer.",
    });
    return true;
  }

  // all other errors
  toast.error("Kunne ikke hente bildet", {
    description: "Noe gikk galt, Prøv igjen senere.",
  });
  return true;
}

function FadeInOut({
  show,
  className,
  animateOnMount = true,
  children,
}: {
  show: boolean;
  className?: string;
  animateOnMount?: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={animateOnMount}>
      {show && (
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PhotoViewModal({ onClose, options }: Props) {
  const [initialOptions] = useState(options);

  return (
    <PhotoModalWrapper onClose={onClose}>
      {initialOptions.modalType === "goodPhotos" ? (
        <GoodPhotosView options={initialOptions} onClose={onClose} />
      ) : (
        <SearchMotiveView options={initialOptions} onClose={onClose} />
      )}
    </PhotoModalWrapper>
  );
}

type GoodPhotosOptions = Extract<
  PhotoViewModalOptions,
  { modalType: "goodPhotos" }
>;
type SearchMotiveOptions = Extract<
  PhotoViewModalOptions,
  { modalType: "searchMotive" }
>;

// Replaces the photoViewModal search param without adding a history entry.
function replacePhotoViewModalSearch(
  router: ReturnType<typeof useRouter>,
  photoViewModal: PhotoViewModalOptions,
) {
  const { pathname, hash } = router.state.location;
  const search = router.options.stringifySearch({
    ...router.state.location.search,
    photoViewModal,
  });
  history.replaceState(history.state, "", pathname + search + hash);
}

// The good photos feed
function GoodPhotosView({
  options,
  onClose,
}: {
  options: GoodPhotosOptions;
  onClose: () => void;
}) {
  const { placement, error } = useGoodPhotoPlacement(options.photoId, {
    page: options.likelyAt.page,
    positionInPage: options.likelyAt.pos,
  });

  useEffect(() => {
    if (checkAndDisplayLoadingError(error)) {
      onClose();
    }
  }, [error, onClose]);

  if (!placement) {
    return <div className={`${styles.mainPhotoSkeleton} skeleton`} />;
  }

  return (
    <GoodPhotosGallery
      startPage={placement.page}
      pictureId={options.photoId}
      onClose={onClose}
    />
  );
}

function GoodPhotosGallery({
  startPage,
  pictureId,
  onClose,
}: {
  startPage: number;
  pictureId: string;
  onClose: () => void;
}) {
  const {
    data: goodPhotos,
    photos,
    ...pagination
  } = useFlatGoodPhotos(startPage);
  const router = useRouter();

  const handleSelectedPhotoChange = useCallback(
    (selectedPhoto: PhotoDto) => {
      const page = goodPhotos?.pages.find((p) =>
        p.currentList.some((c) => c.photoId.id === selectedPhoto.photoId.id),
      );
      if (!page) return;

      const pos = page.currentList.findIndex(
        (p) => p.photoId.id === selectedPhoto.photoId.id,
      );
      replacePhotoViewModalSearch(router, {
        modalType: "goodPhotos",
        likelyAt: { page: page.page, pos },
        photoId: selectedPhoto.photoId.id,
      });
    },
    [goodPhotos, router],
  );

  return (
    <PhotoGalleryBody
      photos={photos}
      pagination={pagination}
      firstLoadedPage={goodPhotos?.pages[0]?.page}
      initialPhotoId={pictureId}
      onClose={onClose}
      onSelectedPhotoChange={handleSelectedPhotoChange}
    />
  );
}

function SearchMotiveView({
  options,
  onClose,
}: {
  options: SearchMotiveOptions;
  onClose: () => void;
}) {
  const { photos, error, ...pagination } = useInfiniteMotivePhotos(
    options.motiveId,
  );

  useEffect(() => {
    if (checkAndDisplayLoadingError(error)) {
      onClose();
    }
  }, [error, onClose]);

  const router = useRouter();

  const handleSelectedPhotoChange = useCallback(
    (selectedPhoto: PhotoDto) => {
      replacePhotoViewModalSearch(router, {
        modalType: "searchMotive",
        motiveId: options.motiveId,
        photoId: selectedPhoto.photoId.id,
      });
    },
    [router, options.motiveId],
  );

  useEffect(() => {
    if (!photos || photos.length === 0) {
      return;
    }

    if (!photos.some((v) => v.photoId.id === options.photoId)) {
      toast.error("Fant ikke bildet", {
        description: "Du ser nå bilder fra hele arrangementet",
      });
    }
  }, [photos]);

  return (
    <PhotoGalleryBody
      photos={photos}
      pagination={pagination}
      firstLoadedPage={undefined}
      initialPhotoId={options.photoId}
      onClose={onClose}
      onSelectedPhotoChange={handleSelectedPhotoChange}
    />
  );
}

// Shared gallery shell: selection state, keyboard navigation and the
// mobile/desktop layouts. Data source specifics live in the wrappers above.
function PhotoGalleryBody({
  photos,
  pagination,
  firstLoadedPage,
  initialPhotoId,
  onClose,
  onSelectedPhotoChange,
}: {
  photos: PhotoDto[];
  pagination: GalleryPagination;
  firstLoadedPage: number | undefined;
  initialPhotoId: string;
  onClose: () => void;
  onSelectedPhotoChange?: (photo: PhotoDto) => void;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | undefined>();
  const [isFocused, setIsFocused] = useState(false);
  const { isInactive } = useInactivity({ inactiveDelayMs: 2000 });
  const hideUI = isFocused && isInactive;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const currentIndex = selectedPhoto
    ? photos.findIndex((p) => p.photoId.id === selectedPhoto.photoId.id)
    : -1;

  useArrowKeyNavigation({
    onNext: () => {
      if (currentIndex >= 0 && currentIndex < photos.length - 1) {
        setSelectedPhoto(photos[currentIndex + 1]);
      }
    },
    onPrevious: () => {
      if (currentIndex > 0) {
        setSelectedPhoto(photos[currentIndex - 1]);
      }
    },
  });

  // select the initial photo once the list it lives on has loaded
  useEffect(() => {
    if (selectedPhoto || photos.length === 0) return;
    setSelectedPhoto(photos.find((p) => p.photoId.id === initialPhotoId));
  }, [photos, initialPhotoId, selectedPhoto]);

  // keep the url bar in sync with the shown photo
  useEffect(() => {
    if (selectedPhoto) onSelectedPhotoChange?.(selectedPhoto);
  }, [selectedPhoto, onSelectedPhotoChange]);

  return (
    <>
      <FadeInOut
        show={!hideUI}
        className={styles.closeButton}
        animateOnMount={false}
      >
        <IconButton aria-label="Lukk" variant="transparent" onClick={onClose}>
          <X />
        </IconButton>
      </FadeInOut>
      {isMobile ? (
        <>
          <div
            className={`${styles.actionButtonGroup} ${styles.mobileActionGroup}`}
          >
            <PhotoActionButtons selectedPhoto={selectedPhoto} />
          </div>
          <div className={styles.mobileContent}>
            <SwipeableMainPhoto
              photos={photos}
              selectedPhoto={selectedPhoto}
              onSelectPhoto={setSelectedPhoto}
            />
            <PhotoViewBottomStrip
              photos={photos}
              pagination={pagination}
              firstLoadedPage={firstLoadedPage}
              selectedPhoto={selectedPhoto}
              onSelectPhoto={setSelectedPhoto}
            />
          </div>
        </>
      ) : (
        <>
          <FadeInOut
            show={!hideUI}
            className={styles.focusToggle}
            animateOnMount={false}
          >
            <IconButton
              aria-label="Fokuser bilde"
              variant="transparent"
              onClick={() => setIsFocused((f) => !f)}
            >
              <PanelLeft className={styles.focusToggleIcon} />
            </IconButton>
          </FadeInOut>
          <PhotoViewSidebar
            photos={photos}
            pagination={pagination}
            firstLoadedPage={firstLoadedPage}
            selectedPhoto={selectedPhoto}
            onSelectPhoto={setSelectedPhoto}
            isFocused={isFocused}
          />
          <PhotoViewMainContent
            selectedPhoto={selectedPhoto}
            onToggleFocus={() => setIsFocused((f) => !f)}
            isFocused={isFocused}
          />
        </>
      )}
    </>
  );
}

// Download, copy link and metadata buttons, shared by both layouts
function PhotoActionButtons({ selectedPhoto }: { selectedPhoto?: PhotoDto }) {
  const { copied, copy } = useCopyToClipboard();
  const { requestDownload, creditPopUp } = usePhotoDownload();

  return (
    <>
      <IconButton
        variant="subtle"
        aria-label="Last ned bildet"
        className={styles.actionButton}
        onClick={() => selectedPhoto && requestDownload(selectedPhoto)}
      >
        <Download />
      </IconButton>
      <IconButton
        onClick={() => {
          if (selectedPhoto) {
            copy({ text: globalThis.location.href });
          }
        }}
        variant="subtle"
        aria-label="Kopier bildelenke"
        className={styles.actionButton}
      >
        <span className={styles.copyContent}>
          <span className={styles.iconStack}>
            <AnimatePresence initial={false}>
              <motion.span
                key={copied ? "check" : "link"}
                className={styles.iconLayer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? <Check /> : <Link />}
              </motion.span>
            </AnimatePresence>
          </span>
          <AnimatePresence initial={false}>
            {copied && (
              <motion.span
                className={styles.copyLabel}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ ease: EASE_OUT_EXPO, duration: 0.3 }}
              >
                <span className={styles.copyLabelText}>Kopiert!</span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </IconButton>
      <IconButton
        variant="subtle"
        aria-label="Vis metadata"
        className={styles.actionButton}
      >
        <Info />
      </IconButton>
      {creditPopUp}
    </>
  );
}

// Main photo display area for desktop
function PhotoViewMainContent({
  selectedPhoto,
  onToggleFocus,
  isFocused,
}: {
  selectedPhoto?: PhotoDto;
  onToggleFocus: () => void;
  isFocused: boolean;
}) {
  return (
    <div className={styles.mainContentWrapper}>
      {selectedPhoto ? (
        <img
          src={selectedPhoto.imageWeb}
          alt=""
          className={styles.mainPhoto}
          onClick={onToggleFocus}
        />
      ) : (
        <div className={`${styles.mainPhotoSkeleton} skeleton`} />
      )}
      <FadeInOut
        show={!isFocused}
        animateOnMount={false}
        className={styles.actionButtonGroup}
      >
        <PhotoActionButtons selectedPhoto={selectedPhoto} />
      </FadeInOut>
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
function SwipeableMainPhoto({
  photos,
  selectedPhoto,
  onSelectPhoto,
}: {
  photos: PhotoDto[];
  selectedPhoto?: PhotoDto;
  onSelectPhoto: (photo: PhotoDto) => void;
}) {
  const currentIndex = selectedPhoto
    ? photos.findIndex((p) => p.photoId.id === selectedPhoto.photoId.id)
    : -1;
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
              if (
                swipe < -SWIPE_THRESHOLD &&
                currentIndex < photos.length - 1
              ) {
                onSelectPhoto(photos[currentIndex + 1]);
              } else if (swipe > SWIPE_THRESHOLD && currentIndex > 0) {
                onSelectPhoto(photos[currentIndex - 1]);
              }
            }}
          />
        </AnimatePresence>
      ) : (
        <div className={`${styles.mainPhotoSkeleton} skeleton`} />
      )}
    </div>
  );
}
