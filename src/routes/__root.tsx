import { useState, useMemo, useContext } from "react";
import Footer from "@/components/Footer/Footer";
import HeaderComponent from "../components/Header/Header";
import { AlertContext, severityEnum } from "../contexts/AlertContext";
import { ImageContext } from "../contexts/ImageContext";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoDto } from "../../generated";
import { createImgUrl } from "../utils/createImgUrl/createImgUrl";
import DownloadButton from "../components/DownloadImages/DownloadButton/DownloadButton";
import { AdBannerContext } from "../contexts/AdBannerContext";
import {
  createRootRouteWithContext,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import styles from "./__root.module.css";
import {
  AuthenticationContext,
  AuthState,
} from "../contexts/AuthenticationContext";
import TitleBanner from "@/components/TitleBanner/TitleBanner";
import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/overlay/Toast";
import { X } from "lucide-react";

interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function SliderToolbar({
  currentIndex,
  isAuthenticated,
}: {
  currentIndex: unknown;
  isAuthenticated: boolean;
}) {
  return (
    <DownloadButton
      currentIndex={currentIndex}
      isAuthenticated={isAuthenticated}
    />
  );
}

function SliderOverlay({ photo }: { photo: PhotoDto }) {
  return <TitleBanner photo={photo} />;
}

function RootComponent() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(severityEnum.INFO);
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showAdBanner, setShowAdBanner] = useState(false);
  const [shouldShowAdBanner, setShouldShowAdBanner] = useState(true);

  const alertContextValue = useMemo(
    () => ({ open, setOpen, setMessage, message, setSeverity, severity }),
    [open, message, severity],
  );

  const imageContextValue = useMemo(
    () => ({ isOpen, setIsOpen, photoIndex, setPhotoIndex, photos, setPhotos }),
    [isOpen, photoIndex, photos],
  );

  const adBannerContextValue = useMemo(
    () => ({
      showAdBanner,
      setShowAdBanner,
      shouldShowAdBanner,
      setShouldShowAdBanner,
    }),
    [showAdBanner, shouldShowAdBanner],
  );

  const { isAuthenticated } = useContext(AuthenticationContext);
  const isFullPage = useRouterState({
    select: (s) => s.location.pathname.endsWith("/upload"),
  });

  return (
    <ToastProvider>
      <AdBannerContext.Provider value={adBannerContextValue}>
        <ImageContext.Provider value={imageContextValue}>
          <AlertContext.Provider value={alertContextValue}>
            {isFullPage ? (
              <div className={styles.fullPage}>
                <HeaderComponent />
                <Outlet />
              </div>
            ) : (
              <>
                <HeaderComponent />
                <div className={styles.main}>
                  <Outlet />
                </div>
                <Footer />
              </>
            )}
          </AlertContext.Provider>

          <PhotoSlider
            images={photos.map((p) => ({
              src: createImgUrl(p),
              key: createImgUrl(p),
            }))}
            visible={isOpen}
            index={photoIndex}
            onClose={() => setIsOpen(false)}
            onIndexChange={(newIndex) => setPhotoIndex(newIndex)}
            toolbarRender={(photoIndex) => (
              <SliderToolbar
                currentIndex={photoIndex}
                isAuthenticated={isAuthenticated}
              />
            )}
            overlayRender={() => <SliderOverlay photo={photos[photoIndex]} />}
          />
        </ImageContext.Provider>
      </AdBannerContext.Provider>

      <Toast
        open={open}
        onOpenChange={setOpen}
        duration={4000}
        severity={severity}
      >
        <span>{message}</span>
        <ToastClose aria-label="Lukk">
          <X size={16} />
        </ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
