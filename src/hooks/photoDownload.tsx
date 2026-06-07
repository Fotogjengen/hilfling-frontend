import { useEffect, useRef, useState } from "react";
import { PhotoDto } from "../../generated";
import CreditPopUp from "@/components/DownloadImages/CreditPopUp/CreditPopUp";
import { useAuth } from "@/contexts/AuthenticationContext";

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

export function usePhotoDownload() {
  const { isAuthenticated } = useAuth();
  const [triggerCreditPopUp, setTriggerCreditPopUp] = useState(false);
  const [creditAccepted, setCreditAccepted] = useState(false);
  const pendingPhoto = useRef<PhotoDto | null>(null);

  // once the user accepts crediting, download whatever they requested
  useEffect(() => {
    if (creditAccepted && pendingPhoto.current) {
      const photo = pendingPhoto.current;
      pendingPhoto.current = null;
      downloadImage(photo).catch((error) =>
        console.error("Download failed:", error),
      );
    }
  }, [creditAccepted]);

  const requestDownload = (photo: PhotoDto) => {
    if (creditAccepted) {
      downloadImage(photo).catch((error) =>
        console.error("Download failed:", error),
      );
    } else {
      pendingPhoto.current = photo;
      setTriggerCreditPopUp(true);
    }
  };

  const creditPopUp = triggerCreditPopUp ? (
    <CreditPopUp
      isAuthenticated={isAuthenticated}
      setTriggerCreditPopUp={setTriggerCreditPopUp}
      setcreditAccepted={setCreditAccepted}
    />
  ) : null;

  return { requestDownload, creditPopUp };
}
