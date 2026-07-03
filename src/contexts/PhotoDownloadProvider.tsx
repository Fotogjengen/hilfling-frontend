import { createContext, useContext, useMemo, useRef, useState } from "react";
import { PhotoDto } from "../../generated";
import CreditPopUp from "@/components/DownloadImages/CreditPopUp/CreditPopUp";
import { useAuth } from "@/contexts/AuthProvider";

/** Downloads a specific photo */
async function downloadImage(photo: PhotoDto) {
  const url = photo.imageProd ?? photo.imageWeb;
  if (!url) return;

  const fileName = url.split("/").pop() || `${photo.imageNumber}.jpg`;

  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(objectUrl);
}

interface PhotoDownloadContext {
  requestDownload: (photo: PhotoDto) => void;
}

const PhotoDownloadContext = createContext<PhotoDownloadContext>(
  {} as PhotoDownloadContext,
);

export const usePhotoDownload = () => useContext(PhotoDownloadContext);

const PhotoDownloadProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [showCreditPopUp, setShowCreditPopUp] = useState(false);
  const [creditAccepted, setCreditAccepted] = useState(false);
  const pendingPhoto = useRef<PhotoDto | null>(null);

  const value = useMemo(
    () => ({
      requestDownload: (photo: PhotoDto) => {
        if (creditAccepted) {
          downloadImage(photo).catch((error) =>
            console.error("Download failed:", error),
          );
        } else {
          pendingPhoto.current = photo;
          setShowCreditPopUp(true);
        }
      },
    }),
    [creditAccepted],
  );

  const handleAccept = () => {
    setCreditAccepted(true);
    setShowCreditPopUp(false);
    const photo = pendingPhoto.current;
    pendingPhoto.current = null;
    if (photo) {
      downloadImage(photo).catch((error) =>
        console.error("Download failed:", error),
      );
    }
  };

  const handleAbort = () => {
    pendingPhoto.current = null;
    setShowCreditPopUp(false);
  };

  return (
    <PhotoDownloadContext.Provider value={value}>
      {children}
      {showCreditPopUp && (
        <CreditPopUp
          isAuthenticated={isAuthenticated}
          onAccept={handleAccept}
          onAbort={handleAbort}
        />
      )}
    </PhotoDownloadContext.Provider>
  );
};

export default PhotoDownloadProvider;
