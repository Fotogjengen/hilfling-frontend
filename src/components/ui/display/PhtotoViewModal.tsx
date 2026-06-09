import { PhotoViewModalOptions } from "@/types";
import { Dialog } from "radix-ui";
import styles from "./PhotoViewModal.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "../input/IconButton";
import { Check, Download, Info, Link, PanelLeft, X } from "lucide-react";
import { GOOD_PHOTOS_PAGE_SIZE, useGoodPhotosFromPage } from "@/hooks/photo";
import { PhotoDto } from "../../../../generated";
import { useRouter } from "@tanstack/react-router";
import { useCopyToClipboard } from "@/hooks/clipboard";
import { usePhotoDownload } from "@/hooks/photoDownload";
import { useArrowKeyNavigation } from "@/hooks/arrowKeyNavigation";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

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
        <div className={styles.dialogOverlay} />
        <Dialog.Content
          className={styles.dialogContent}
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

export default function PhotoViewModal({ onClose, options }: Props) {
  const [initialOptions] = useState(options);
  const { data: goodPhotos, isPending } = useGoodPhotosFromPage(
    initialOptions.page,
  );
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | undefined>();
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const photos = useMemo(
    () => goodPhotos?.pages.flatMap((page) => page.currentList) ?? [],
    [goodPhotos],
  );

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
      <div className={styles.closeButton}>
        <IconButton aria-label="Lukk" variant="transparent" onClick={onClose}>
          <X />
        </IconButton>
      </div>
      <div className={styles.focusToggle}>
        <IconButton
          aria-label="Fokuser bilde"
          variant="transparent"
          onClick={() => setIsFocused((f) => !f)}
        >
          <PanelLeft className={styles.focusToggleIcon} />
        </IconButton>
      </div>
      <PhotoViewSidebar
        selectedPhoto={selectedPhoto}
        initialPage={initialOptions.page}
        initialPositionInPage={initialOptions.positionInPage}
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
      <img
        src={selectedPhoto?.imageWeb}
        alt=""
        className={styles.mainPhoto}
        onClick={onToggleFocus}
      />
      <AnimatePresence>
        {!isFocused && (
          <motion.div
            className={styles.actionButtonGroup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
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
          </motion.div>
        )}
      </AnimatePresence>
      {creditPopUp}
    </div>
  );
}

function SidebarSpacer() {
  return <div className={styles.sidebarSpacer} />;
}

// Sidebar
function PhotoViewSidebar({
  selectedPhoto,
  initialPage,
  initialPositionInPage,
  onSelectPhoto,
  isFocused,
}: {
  selectedPhoto?: PhotoDto;
  initialPage: number;
  initialPositionInPage: number;
  onSelectPhoto: (photo: PhotoDto) => void;
  isFocused: boolean;
}) {
  const {
    data: goodPhotos,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useGoodPhotosFromPage(initialPage);
  const photos = useMemo(
    () => goodPhotos?.pages.flatMap((page) => page.currentList) ?? [],
    [goodPhotos],
  );

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const firstLoadedPage = goodPhotos?.pages[0]?.page ?? initialPage;
  const firstItemIndex = firstLoadedPage * GOOD_PHOTOS_PAGE_SIZE;

  const didInitialCenter = useRef(false);
  useEffect(() => {
    if (!selectedPhoto) return;
    if (!didInitialCenter.current) {
      didInitialCenter.current = true;
      return;
    }
    const index = photos.findIndex(
      (p) => p.photoId.id === selectedPhoto.photoId.id,
    );
    if (index >= 0) {
      virtuosoRef.current?.scrollToIndex({ index, align: "center" });
    }
  }, [selectedPhoto]);

  return (
    <motion.div
      className={styles.photoViewSidebarBackground}
      animate={{
        x: isFocused ? "-100%" : "0%",
        marginRight: isFocused ? "-20%" : "0%",
      }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
    >
      {photos.length > 0 && (
        <Virtuoso
          ref={virtuosoRef}
          className={styles.photoViewSidebarList}
          data={photos}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={{
            index: initialPositionInPage,
            align: "center",
          }}
          increaseViewportBy={600}
          components={{ Header: SidebarSpacer, Footer: SidebarSpacer }}
          startReached={() => {
            if (hasPreviousPage && !isFetchingPreviousPage) {
              void fetchPreviousPage();
            }
          }}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          itemContent={(_index, photo) => (
            <div className={styles.sidebarItem}>
              <img
                onClick={() => onSelectPhoto(photo)}
                src={photo.imageWeb}
                alt=""
                className={`${styles.sidebarPhoto} ${photo.photoId.id === selectedPhoto?.photoId.id ? styles.selectedSidebarPhoto : ""}`}
              />
            </div>
          )}
        />
      )}
    </motion.div>
  );
}
