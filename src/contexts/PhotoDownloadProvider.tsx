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

/** Downloads a specific photo */
async function downloadImage(photo: PhotoDto, quality: PhotoQuality) {
  const url = quality === "prod" ? photo.imageProd! : photo.imageWeb!;
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

  const pendingPhoto = useRef<PhotoDto | null>(null);

  const value = useMemo(
    () => ({
      requestDownload: (photo: PhotoDto) => {
        pendingPhoto.current = photo;
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
    const photo = pendingPhoto.current;
    pendingPhoto.current = null;
    if (photo) {
      downloadImage(photo, selectedQuality).catch((error) =>
        toast.error("Kunne ikke laste ned bildet", {
          description: `Noe gikk galt. Feilkode: ${error}`,
        }),
      );
    }
  };

  const handleAbort = () => {
    pendingPhoto.current = null;
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
