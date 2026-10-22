import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PhotoDto } from "../../generated";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/components/ui/overlay/Toaster";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { CreditAcknowledgement } from "@/components/DownloadImages/CreditAcknowledgement";
import { Button } from "@/components/ui/input/Button";
import { QualitySelector } from "@/components/DownloadImages/QualitySelector";
import { PhotoQuality } from "@/types";
import * as Sentry from "@sentry/react";

// the browser can trigger a popup here, we should let the files stay in memory for some time
// so that we can wait for the popup to conclude
const REVOKE_DELAY_MS = 60 * 1000 * 2;

/** Downloads a specific photo */
async function downloadImage(photo: PhotoDto, quality: PhotoQuality) {
  const url = quality === "prod" ? photo.imageProd! : photo.imageWeb!;
  if (!url) return;

  const fileName = url.split("/").pop() || `${photo.imageNumber}.jpg`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Kunne ikke laste ned bildet (HTTP ${response.status})`);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), REVOKE_DELAY_MS);
}

interface PhotoDownloadContext {
  requestDownload: (photos: PhotoDto[]) => void;
}

const PhotoDownloadContext = createContext<PhotoDownloadContext>(
  {} as PhotoDownloadContext,
);

export const usePhotoDownload = () => useContext(PhotoDownloadContext);

// quality leads into credit, if credit has not already been accepted
type PopupPhase = "quality" | "credit";

const PhotoDownloadProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [popupPhase, setPopupPhase] = useState<PopupPhase>("quality");
  const [creditAccepted, setCreditAccepted] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<PhotoQuality>(
    isAuthenticated ? "prod" : "web",
  );
  const [nextButtonShouldBeDisabled, setNextButtonShouldBeDisabled] =
    useState(false);

  useEffect(() => {
    if (selectedQuality === "prod" && isAuthenticated === false) {
      setNextButtonShouldBeDisabled(true);
      return;
    }
    setNextButtonShouldBeDisabled(false);
  }, [selectedQuality]);

  const pendingPhotos = useRef<PhotoDto[]>([]);

  const value = useMemo(
    () => ({
      requestDownload: (photos: PhotoDto[]) => {
        pendingPhotos.current = photos;
        setShouldShowPopup(true);
        setPopupPhase("quality");
      },
    }),
    [creditAccepted],
  );

  const handleCreditAccept = () => {
    setCreditAccepted(true);
    setShouldShowPopup(false);
    downloadPhoto();
  };

  const downloadPhoto = () => {
    const photos = pendingPhotos.current;
    pendingPhotos.current = [];
    for (const photo of photos) {
      downloadImage(photo, selectedQuality).catch((error) => {
        // since this does not go through axios, we need to capture an error here manually
        Sentry.captureException(error);
        toast.error("Kunne ikke laste ned bildet", {
          description: `Noe gikk galt. Feilkode: ${error}`,
        });
      });
    }
  };

  const handleAbort = () => {
    pendingPhotos.current = [];
    setShouldShowPopup(false);
  };

  const handleNextStep = () => {
    if (popupPhase === "quality") {
      if (!creditAccepted) {
        setPopupPhase("credit");
      } else {
        setShouldShowPopup(false);
        downloadPhoto();
      }
      return;
    }

    handleCreditAccept();
  };

  return (
    <PhotoDownloadContext.Provider value={value}>
      {children}
      {shouldShowPopup && (
        <Dialog
          open
          onOpenChange={handleAbort}
          title={
            popupPhase === "credit" ? "Husk kreditering!" : "Velg kvalitet"
          }
          actions={
            <Button
              disabled={nextButtonShouldBeDisabled}
              onClick={() => handleNextStep()}
            >
              Last ned
            </Button>
          }
        >
          {popupPhase === "quality" && (
            <QualitySelector
              onQualitySelect={(quality) => setSelectedQuality(quality)}
            />
          )}
          {popupPhase === "credit" && (
            <CreditAcknowledgement isAuthenticated={isAuthenticated} />
          )}
        </Dialog>
      )}
    </PhotoDownloadContext.Provider>
  );
};

export default PhotoDownloadProvider;
