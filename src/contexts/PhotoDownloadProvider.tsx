import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { zipSync, Zippable } from "fflate";
import { PhotoDto } from "../../generated";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "@/components/ui/overlay/Toaster";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { CreditAcknowledgement } from "@/components/DownloadImages/CreditAcknowledgement";
import { Button } from "@/components/ui/input/Button";
import { QualitySelector } from "@/components/DownloadImages/QualitySelector";
import { PhotoQuality } from "@/types";

// the browser can trigger a popup here, we should let the files stay in memory for some time
// so that we can wait for the popup to conclude
const REVOKE_DELAY_MS = 60 * 1000 * 2;

async function fetchPhoto(photo: PhotoDto, quality: PhotoQuality) {
  const url = quality === "prod" ? photo.imageProd : photo.imageWeb;
  if (!url) return null;

  const fileName = url.split("/").pop() || `${photo.imageNumber}.jpg`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Kunne ikke laste ned bildet (HTTP ${response.status})`);
  }
  return { fileName, blob: await response.blob() };
}

function saveBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), REVOKE_DELAY_MS);
}

// named after the motive when all photos belong to the same one
function zipFileName(photos: PhotoDto[]) {
  const titles = new Set(photos.map((photo) => photo.motive.title));
  const [title] = titles;
  const name =
    titles.size === 1
      ? title
          .replace(/[\\/:*?"<>|]/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : "";
  return `${name || "fg-bilder"}.zip`;
}

/** Downloads a single photo directly, or several photos bundled in a zip */
async function downloadPhotos(photos: PhotoDto[], quality: PhotoQuality) {
  const title =
    photos.length > 1
      ? `Zipper og laster ned ${photos.length} bilder`
      : "Laster ned bilde";
  const progressOptions = (done: number) => ({
    description: `${done} av ${photos.length}`,
    value: (done / photos.length) * 100,
  });
  const toastId = toast.progress(title, progressOptions(0));

  try {
    let done = 0;
    const fetched = await Promise.all(
      photos.map(async (photo) => {
        const file = await fetchPhoto(photo, quality);
        done += 1;
        toast.progress(title, { id: toastId, ...progressOptions(done) });
        return file;
      }),
    );
    await saveFiles(
      fetched.filter((file) => file !== null),
      zipFileName(photos),
    );
  } finally {
    toast.dismiss(toastId);
  }
}

async function saveFiles(
  files: { fileName: string; blob: Blob }[],
  zipName: string,
) {
  if (files.length === 0) return;

  if (files.length === 1) {
    saveBlob(files[0].blob, files[0].fileName);
    return;
  }

  const buffers = await Promise.all(
    files.map((file) => file.blob.arrayBuffer()),
  );
  const entries: Zippable = {};
  files.forEach((file, index) => {
    entries[file.fileName] = new Uint8Array(buffers[index]);
  });

  // images are already compressed, so we only store them
  const zipped = zipSync(entries, { level: 0 });
  saveBlob(new Blob([zipped], { type: "application/zip" }), zipName);
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
    downloadPhotos(photos, selectedQuality).catch((error) => {
      toast.error(
        photos.length > 1
          ? "Kunne ikke laste ned bildene"
          : "Kunne ikke laste ned bildet",
        { description: `Noe gikk galt. Feilkode: ${error}` },
      );
    });
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
