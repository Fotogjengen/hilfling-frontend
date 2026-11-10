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
import { PhotoApi } from "@/utils/api/PhotoApi";

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

  const nextButtonShouldBeDisabled =
    selectedQuality === "prod" && !isAuthenticated;

  useEffect(() => {
    setSelectedQuality(isAuthenticated ? "prod" : "web");
  }, [isAuthenticated]);

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

  const handleCreditAccept = async () => {
    setCreditAccepted(true);
    await downloadPhoto();
    setShouldShowPopup(false);
  };

  const downloadPhoto = async () => {
    const photos = pendingPhotos.current;
    pendingPhotos.current = [];

    for (const photo of photos) {
      try {
        let currentPhoto = photo;

        if (selectedQuality === "prod" && !photo.imageProd) {
          const updatedPhotos = await PhotoApi.getAllByMotiveId(
            photo.motive.motiveId.id,
          );

          currentPhoto =
            updatedPhotos.find((p) => p.photoId.id === photo.photoId.id) ??
            photo;
        }

        if (selectedQuality === "prod" && !currentPhoto.imageProd) {
          throw new Error("Prod-bildet er fortsatt ikke tilgjengelig");
        }

        await downloadImage(currentPhoto, selectedQuality);
      } catch (error) {
        toast.error("Kunne ikke laste ned bildet", {
          description: String(error),
        });
      }
    }
  };

  const handleAbort = () => {
    pendingPhotos.current = [];
    setShouldShowPopup(false);
  };

  const handleNextStep = async () => {
    if (popupPhase === "quality") {
      if (!creditAccepted) {
        setPopupPhase("credit");
      } else {
        await downloadPhoto();
        setShouldShowPopup(false);
      }
      return;
    }

    await handleCreditAccept();
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
              onClick={() => void handleNextStep()}
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
