import { useState, useEffect, useMemo } from "react";

import {
  Box,
  ThemeProvider,
  Typography,
  Button,
  CssBaseline,
} from "@mui/material";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { GuiFooter } from "./gui-components";
import HeaderComponent from "./components/Header/Header";
import { theme } from "./styles/muiStyles";
import { AlertContext, severityEnum } from "./contexts/AlertContext";
import { ImageContext } from "./contexts/ImageContext";
import Alert from "./components/Alert/Alert";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoDto } from "../generated";
import { createImgUrl } from "./utils/createImgUrl/createImgUrl";
import { AuthenticationContext } from "./contexts/AuthenticationContext";
import Cookies from "js-cookie";
import { decryptData, encryptData } from "./utils/encryption/encrypt";
import DownloadButton from "./components/DownloadImages/DownloadButton/DownloadButton";
import { AdBannerContext } from "./contexts/AdBannerContext";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      sx={{
        m: 4,
        p: 3,
        backgroundColor: "#fff0f0",
        border: "1px solid #ff0000",
        borderRadius: 1,
      }}
    >
      <Typography variant="h5" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography
        variant="body2"
        component="pre"
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "monospace",
          backgroundColor: "#fff",
          p: 2,
          borderRadius: 1,
        }}
      >
        {error instanceof Error ? error.message : String(error)}
        {"\n\n"}
        {error instanceof Error ? error.stack : ""}
      </Typography>
      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 2 }}
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </Box>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
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

  // Hooks for Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [position, setPosition] = useState("oo"); //Change maybe? verv?

  // Checks if the user is logged in when the page loads
  useEffect(() => {
    const data = decryptData(Cookies.get("fgData") || "");
    if (data !== "") {
      const parsedData = JSON.parse(data);
      setIsAuthenticated(parsedData.isAuthenticated);
      setPosition(parsedData.position);
    }
  }, []);

  // Saves authentication status for the user as a cookie when authentication is changed
  useEffect(() => {
    const data = {
      isAuthenticated,
      position,
    };
    Cookies.set("fgData", encryptData(JSON.stringify(data)));
  }, [isAuthenticated, position]);

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

  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      position,
      setPosition,
    }),
    [isAuthenticated, position],
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

  return (
    <html lang="no">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fotogjengen</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdBannerContext.Provider value={adBannerContextValue}>
              <ImageContext.Provider value={imageContextValue}>
                <AuthenticationContext.Provider value={authContextValue}>
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
                      {children}
                    </Box>
                    <GuiFooter />
                  </AlertContext.Provider>
                </AuthenticationContext.Provider>

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
        </ErrorBoundary>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
