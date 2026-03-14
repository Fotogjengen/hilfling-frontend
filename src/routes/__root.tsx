import { useState, useMemo, useContext } from "react";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import { GuiFooter } from "../gui-components";
import HeaderComponent from "../components/Header/Header";
import { theme } from "../styles/muiStyles";
import { AlertContext, severityEnum } from "../contexts/AlertContext";
import { ImageContext } from "../contexts/ImageContext";
import Alert from "../components/Alert/Alert";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoDto } from "../../generated";
import { createImgUrl } from "../utils/createImgUrl/createImgUrl";
import DownloadButton from "../components/DownloadImages/DownloadButton/DownloadButton";
import { AdBannerContext } from "../contexts/AdBannerContext";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import {
  AuthenticationContext,
  AuthState,
} from "../contexts/AuthenticationContext";

// What state we want to pass along with the router context.
interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  // Hooks for the Alert component
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(severityEnum.INFO);
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Hooks for Ad Banner
  const [showAdBanner, setShowAdBanner] = useState(false);
  const [shouldShowAdBanner, setShouldShowAdBanner] = useState(true);

  // Memoized context values to avoid unnecessary re-renders
  const alertContextValue = useMemo(
    () => ({
      open,
      setOpen,
      setMessage,
      message,
      setSeverity,
      severity,
    }),
    [open, message, severity],
  );

  const imageContextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      photoIndex,
      setPhotoIndex,
      photos,
      setPhotos,
    }),
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AdBannerContext.Provider value={adBannerContextValue}>
        <ImageContext.Provider value={imageContextValue}>
          <AlertContext.Provider value={alertContextValue}>
            {open && (
              <Alert
                open={open}
                setOpen={setOpen}
                message={message}
                severity={severity}
              />
            )}
            <Box sx={{ m: "2rem" }}>
              <HeaderComponent />
              <Outlet />
            </Box>
            <GuiFooter />
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
              <DownloadButton
                currentIndex={photoIndex}
                isAuthenticated={isAuthenticated}
              />
            )}
          />
        </ImageContext.Provider>
      </AdBannerContext.Provider>
    </ThemeProvider>
  );
}
