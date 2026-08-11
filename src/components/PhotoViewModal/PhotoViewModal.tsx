import { PhotoViewModalOptions } from "@/types";
import { Dialog } from "radix-ui";
import styles from "./PhotoViewModal.module.css";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  useFlatGoodPhotos,
  useGoodPhotoPlacement,
  useInfiniteMotivePhotos,
} from "@/hooks/photo";
import { PhotoDto } from "../../../generated";
import { useRouter } from "@tanstack/react-router";
import { hasUserInteracted } from "@/utils/userInteraction";
import { toast } from "../ui/overlay/Toaster";
import { isAxiosError } from "axios";
import { PhotoGalleryBody } from "./PhotoGalleryBody";
import { GalleryPagination } from "./scrollHooks";

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
          onFocusOutside={(event) => event.preventDefault()}
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

function useCloseOnLoadingError(
  error: Error | null | undefined,
  onClose: () => void,
) {
  useEffect(() => {
    if (checkAndDisplayLoadingError(error)) {
      onClose();
    }
  }, [error, onClose]);
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

// Skeleton state for the gallery while we look up which page a photo lives on
const placementPendingPagination: GalleryPagination = {
  isPending: true,
  hasNextPage: false,
  hasPreviousPage: false,
  isFetchingNextPage: false,
  isFetchingPreviousPage: false,
  fetchNextPage: () => Promise.resolve(),
  fetchPreviousPage: () => Promise.resolve(),
};

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

  useCloseOnLoadingError(error, onClose);

  if (!placement) {
    return (
      <PhotoGalleryBody
        photos={[]}
        pagination={placementPendingPagination}
        firstLoadedPage={undefined}
        initialPhotoId={options.photoId}
        onClose={onClose}
      />
    );
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

  useCloseOnLoadingError(error, onClose);

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

  // warn once if the linked photo is not part of this motive
  const hasCheckedInitialPhoto = useRef(false);
  useEffect(() => {
    if (hasCheckedInitialPhoto.current || !photos || photos.length === 0) {
      return;
    }
    hasCheckedInitialPhoto.current = true;

    if (!photos.some((v) => v.photoId.id === options.photoId)) {
      toast.error("Fant ikke bildet", {
        description: "Du ser nå bilder fra hele arrangementet",
      });
    }
  }, [photos, options.photoId]);

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
