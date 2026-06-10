import { PhotoViewModalOptions } from "@/types";
import { Dialog } from "radix-ui";
import styles from "./PhotoViewModal.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { IconButton } from "../input/IconButton";
import { Check, Download, Info, Link, PanelLeft, X } from "lucide-react";
import { useFlatGoodPhotos } from "@/hooks/photo";
import { PhotoDto } from "../../../../generated";
import { useRouter } from "@tanstack/react-router";
import { useCopyToClipboard } from "@/hooks/clipboard";
import { usePhotoDownload } from "@/hooks/photoDownload";
import { useArrowKeyNavigation } from "@/hooks/arrowKeyNavigation";
import { useInactivity } from "@/hooks/useInactivity";
import { PhotoViewSidebar } from "./PhotoViewSidebar";
import { hasUserInteracted } from "@/utils/userInteraction";
import { EASE_OUT_EXPO } from "@/utils/animation";

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
  const {
    data: goodPhotos,
    isPending,
    photos,
  } = useFlatGoodPhotos(initialOptions.page);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | undefined>();
  const [isFocused, setIsFocused] = useState(false);
  const { isInactive } = useInactivity({ inactiveDelayMs: 2000 });
  const hideUI = isFocused && isInactive;
  const router = useRouter();

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

  // whenever data loads, select the correct photo
  useEffect(() => {
    if (isPending) {
      return;
    }

    setSelectedPhoto(
      goodPhotos?.pages.find((page) => page.page === initialOptions.page)
        ?.currentList[initialOptions.positionInPage],
    );
  }, [isPending]);

  // sync url bar with selected photo
  useEffect(() => {
    if (!selectedPhoto) return;

    const page = goodPhotos?.pages.find((p) =>
      p.currentList.some((c) => c.photoId.id === selectedPhoto.photoId.id),
    );
    if (!page) return;

    const positionInPage = page.currentList.findIndex(
      (p) => p.photoId.id === selectedPhoto.photoId.id,
    );

    const { pathname, hash } = router.state.location;
    const search = router.options.stringifySearch({
      ...router.state.location.search,
      photoViewModal: {
        modalType: "goodPictures",
        page: page.page,
        positionInPage,
      },
    });
    history.replaceState(history.state, "", pathname + search + hash);
  }, [selectedPhoto, goodPhotos, router]);

  return (
    <PhotoModalWrapper onClose={onClose}>
      <FadeInOut
        show={!hideUI}
        className={styles.closeButton}
        animateOnMount={false}
      >
        <IconButton aria-label="Lukk" variant="transparent" onClick={onClose}>
          <X />
        </IconButton>
      </FadeInOut>
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
        selectedPhoto={selectedPhoto}
        initialPage={initialOptions.page}
        onSelectPhoto={setSelectedPhoto}
        isFocused={isFocused}
      />
      <PhotoViewMainContent
        selectedPhoto={selectedPhoto}
        onToggleFocus={() => setIsFocused((f) => !f)}
        isFocused={isFocused}
      />
    </PhotoModalWrapper>
  );
}

// Main photo display area
function PhotoViewMainContent({
  selectedPhoto,
  onToggleFocus,
  isFocused,
}: {
  selectedPhoto?: PhotoDto;
  onToggleFocus: () => void;
  isFocused: boolean;
}) {
  const { copied, copy } = useCopyToClipboard();
  const { requestDownload, creditPopUp } = usePhotoDownload();

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
      </FadeInOut>
      {creditPopUp}
    </div>
  );
}
