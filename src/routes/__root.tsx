import { useState, useMemo, useContext } from "react";
import Footer from "@/components/Footer/Footer";
import HeaderComponent from "../components/Header/Header";
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
import { Toaster } from "@/components/ui/overlay/Toaster";

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
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showAdBanner, setShowAdBanner] = useState(false);
  const [shouldShowAdBanner, setShouldShowAdBanner] = useState(true);

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
    <>
      <AdBannerContext.Provider value={adBannerContextValue}>
        <ImageContext.Provider value={imageContextValue}>
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
      <Toaster />
    </>
  );
}
