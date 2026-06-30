import { useState, useMemo } from "react";
import Footer from "@/components/Footer/Footer";
import HeaderComponent from "../components/Header/Header";
import { AdBannerContext } from "../contexts/AdBannerContext";
import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import styles from "./__root.module.css";
import { AuthState } from "../contexts/AuthProvider";
import { Toaster } from "@/components/ui/overlay/Toaster";
import { z } from "zod";
import PhotoViewModal from "@/components/PhotoViewModal/PhotoViewModal";
import { photoViewModalOptions } from "@/types";

interface RouterContext {
  auth: AuthState;
}

const rootSearchSchema = z.object({
  photoViewModal: photoViewModalOptions.optional(),
});

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  validateSearch: rootSearchSchema,
});

function RootComponent() {
  const { photoViewModal } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();

  const closePhotoViewModal = () => {
    if (router.history.canGoBack()) {
      router.history.back();
    } else {
      // No history to pop, stay at location but without modal params
      void navigate({
        to: router.state.location.pathname,
        search: (prev) => ({ ...prev, photoViewModal: undefined }),
        replace: true,
        resetScroll: false,
      });
    }
  };

  const [showAdBanner, setShowAdBanner] = useState(false);
  const [shouldShowAdBanner, setShouldShowAdBanner] = useState(true);

  const adBannerContextValue = useMemo(
    () => ({
      showAdBanner,
      setShowAdBanner,
      shouldShowAdBanner,
      setShouldShowAdBanner,
    }),
    [showAdBanner, shouldShowAdBanner],
  );

  const isFullPage = useRouterState({
    select: (s) => s.location.pathname.endsWith("/upload"),
  });

  return (
    <>
      <AdBannerContext.Provider value={adBannerContextValue}>
        {isFullPage ? (
          <div className={styles.fullPage}>
            <HeaderComponent />
            <Outlet />
          </div>
        ) : (
          <div className={styles.page}>
            <div className={styles.innerPage}>
              <HeaderComponent />
              <div className={styles.main}>
                <Outlet />
              </div>
            </div>
            <Footer />
          </div>
        )}
      </AdBannerContext.Provider>
      <Toaster />
      {photoViewModal && (
        <PhotoViewModal
          options={photoViewModal}
          onClose={closePhotoViewModal}
        />
      )}
    </>
  );
}
