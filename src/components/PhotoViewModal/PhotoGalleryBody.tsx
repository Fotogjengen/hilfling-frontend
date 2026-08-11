import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { PanelLeft, X } from "lucide-react";
import { PhotoDto } from "../../../generated";
import { IconButton } from "@/components/ui/input/IconButton";
import { useArrowKeyNavigation } from "@/hooks/arrowKeyNavigation";
import { useInactivity } from "@/hooks/useInactivity";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FadeInOut } from "./FadeInOut";
import { PhotoActionPanel } from "./PhotoActionPanel";
import { PhotoViewSidebar } from "./PhotoViewSidebar";
import { PhotoViewBottomStrip } from "./PhotoViewBottomStrip";
import { PhotoViewMainContent, SwipeableMainPhoto } from "./MainPhoto";
import { MotiveLink } from "@/components/ui/display/MotiveLink";
import { GalleryPagination } from "./scrollHooks";
import actionStyles from "./PhotoActionPanel.module.css";
import styles from "./PhotoGalleryBody.module.css";

// Selection state for the gallery: which photo is shown, stepping to
// neighbours and keeping the url in sync with the shown photo.
function usePhotoSelection(
  photos: PhotoDto[],
  initialPhotoId: string,
  onSelectedPhotoChange?: (photo: PhotoDto) => void,
) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | undefined>();

  const currentIndex = selectedPhoto
    ? photos.findIndex((p) => p.photoId.id === selectedPhoto.photoId.id)
    : -1;

  const goNext = () => {
    if (currentIndex >= 0 && currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  // select the initial photo once the list it lives on has loaded
  useEffect(() => {
    if (selectedPhoto || photos.length === 0) return;
    setSelectedPhoto(photos.find((p) => p.photoId.id === initialPhotoId));
  }, [photos, initialPhotoId, selectedPhoto]);

  useEffect(() => {
    if (selectedPhoto) onSelectedPhotoChange?.(selectedPhoto);
  }, [selectedPhoto, onSelectedPhotoChange]);

  return { selectedPhoto, setSelectedPhoto, currentIndex, goNext, goPrevious };
}

// Shared gallery shell: selection state, keyboard navigation and the
// mobile/desktop layouts. Data source specifics live in PhotoViewModal.tsx.
export function PhotoGalleryBody({
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
  const { selectedPhoto, setSelectedPhoto, currentIndex, goNext, goPrevious } =
    usePhotoSelection(photos, initialPhotoId, onSelectedPhotoChange);
  const [isFocused, setIsFocused] = useState(false);
  const { isInactive } = useInactivity({ inactiveDelayMs: 1000 });
  const hideUI = isFocused && isInactive;
  const isMobile = useIsMobile();

  // hide the motive link when we are already on the photo's motive page
  const { motiveId } = useParams({ strict: false });
  const showMotiveLink =
    !!selectedPhoto && selectedPhoto.motive.motiveId.id !== motiveId;

  useArrowKeyNavigation({ onNext: goNext, onPrevious: goPrevious });

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
            className={`${actionStyles.actionPanelAnchor} ${styles.mobileActionGroup}`}
          >
            <PhotoActionPanel selectedPhoto={selectedPhoto} />
          </div>

          <div className={styles.mobileContent}>
            <SwipeableMainPhoto
              selectedPhoto={selectedPhoto}
              currentIndex={currentIndex}
              onNext={goNext}
              onPrevious={goPrevious}
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
          >
            <FadeInOut
              show={!isFocused}
              animateOnMount={false}
              className={actionStyles.actionPanelAnchor}
            >
              <PhotoActionPanel selectedPhoto={selectedPhoto} />
            </FadeInOut>
            <FadeInOut
              show={!isFocused}
              animateOnMount={false}
              className={styles.motiveLinkAnchor}
            >
              {showMotiveLink && selectedPhoto && (
                <MotiveLink photo={selectedPhoto} />
              )}
            </FadeInOut>
          </PhotoViewMainContent>
        </>
      )}
    </>
  );
}
