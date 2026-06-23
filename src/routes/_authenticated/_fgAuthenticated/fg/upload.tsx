import { createFileRoute } from "@tanstack/react-router";
import styles from "./upload.module.css";
import MotiveSelector from "@/components/Upload/MotiveSelector";
import MotiveDetails from "@/components/Upload/MotiveDetails";
import MotiveImages from "@/components/Upload/MotiveImages";
import { useState } from "react";
import { MotiveDto } from "../../../../../generated";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/upload",
)({
  component: PhotoUpload,
});

function PhotoUpload() {
  const [selectedMotive, setSelectedMotive] = useState<MotiveDto | null>(null);
  const [isCreatingNewMotive, setIsCreatingNewMotive] = useState(false);

  return (
    <div className={styles.photoUpload}>
      <div
        className={`${styles.sideBar} ${(selectedMotive ?? isCreatingNewMotive) ? styles.sideBarMotiveSelected : ""}`}
      >
        <MotiveSelector
          value={selectedMotive}
          isCreatingNew={isCreatingNewMotive}
          onChange={(motive) => {
            setSelectedMotive(motive);
            setIsCreatingNewMotive(false);
          }}
          onCreateNew={() => {
            setSelectedMotive(null);
            setIsCreatingNewMotive(true);
          }}
        />
        <MotiveDetails
          motive={selectedMotive}
          isCreatingNew={isCreatingNewMotive}
          onSaved={(motive) => {
            setSelectedMotive(motive);
            setIsCreatingNewMotive(false);
          }}
          onCancel={() => setIsCreatingNewMotive(false)}
          onCreateNew={() => {
            setSelectedMotive(null);
            setIsCreatingNewMotive(true);
          }}
        />
      </div>
      <div className={styles.mainContent}>
        <MotiveImages
          motive={selectedMotive}
          isCreatingNewMotive={isCreatingNewMotive}
        />
      </div>
    </div>
  );
}

export default PhotoUpload;
