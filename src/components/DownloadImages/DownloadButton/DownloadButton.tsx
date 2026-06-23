import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import CreditPopUp from "../CreditPopUp/CreditPopUp";
import styles from "./DownloadButton.module.css";

interface Props {
  currentIndex: any;
  isAuthenticated: boolean;
}

const DownloadButton = ({ currentIndex, isAuthenticated }: Props) => {
  const [triggerCreditPopUp, setTriggerCreditPopUp] = useState(false);
  const [creditAccepted, setcreditAccepted] = useState(false);

  //TODO actually implement the logic for downloading pictures when ITK server is linked up.
  const handleDownload = (imageUrl: string, filename = "photo.jpg") => {
    setcreditAccepted(false);
    try {
      console.log(imageUrl);
      console.log(filename);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    const currentImageUrl = currentIndex.url; //this is broken btw
    if (creditAccepted) {
      handleDownload(currentImageUrl);
    }
  }, [creditAccepted]);

  return (
    <div>
      <button
        className={styles.downloadButton}
        onClick={() => setTriggerCreditPopUp(true)}
        aria-label="Last ned"
      >
        <Download size={20} />
      </button>

      {triggerCreditPopUp && (
        <CreditPopUp
          setTriggerCreditPopUp={setTriggerCreditPopUp}
          setcreditAccepted={setcreditAccepted}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default DownloadButton;
