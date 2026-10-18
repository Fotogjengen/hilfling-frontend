import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";
import styles from "./upload.module.css";
import MotiveSelector from "@/components/Upload/MotiveSelector";
import MotiveDetails from "@/components/Upload/MotiveDetails";
import MotiveImages from "@/components/Upload/MotiveImages";
import { ImageViewMode } from "@/components/Upload/MotiveImagesTopbar";
import { motiveDetailKey, useMotive } from "@/hooks/motive";
import { MotiveDto } from "../../../../generated";

const uploadSearchSchema = z.object({
  motive: z.string().optional().catch(undefined),
  view: z.enum(["grid", "table"]).optional().catch(undefined),
  creating: z.literal(true).optional().catch(undefined),
});

export const Route = createFileRoute("/_fgAuthenticated/fg/upload")({
  component: PhotoUpload,
  validateSearch: uploadSearchSchema,
});

function PhotoUpload() {
  const { motive, view = "grid", creating } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const isCreatingNewMotive = creating === true;
  const motiveId = isCreatingNewMotive ? undefined : motive;
  const { data: selectedMotive = null, isError } = useMotive(motiveId);

  useEffect(() => {
    if (!isError) return;
    void navigate({
      search: (prev) => ({ ...prev, motive: undefined }),
      replace: true,
    });
  }, [isError, navigate]);

  const selectMotive = (selected: MotiveDto | null) => {
    if (selected) {
      queryClient.setQueryData(motiveDetailKey(selected.motiveId.id), selected);
    }
    void navigate({
      search: (prev) => ({
        ...prev,
        motive: selected?.motiveId.id,
        creating: undefined,
      }),
    });
  };

  const startCreatingMotive = () => {
    void navigate({
      search: (prev) => ({ ...prev, motive: undefined, creating: true }),
    });
  };

  const setViewMode = (mode: ImageViewMode) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        view: mode === "grid" ? undefined : mode,
      }),
      replace: true,
    });
  };

  return (
    <div className={styles.photoUpload}>
      <div
        className={`${styles.sideBar} ${motiveId || isCreatingNewMotive ? styles.sideBarMotiveSelected : ""}`}
      >
        <MotiveSelector
          value={selectedMotive}
          isCreatingNew={isCreatingNewMotive}
          onChange={selectMotive}
          onCreateNew={startCreatingMotive}
        />
        <MotiveDetails
          motive={selectedMotive}
          isCreatingNew={isCreatingNewMotive}
          onSaved={selectMotive}
          onCancel={() => selectMotive(null)}
          onCreateNew={startCreatingMotive}
        />
      </div>
      <div className={styles.mainContent}>
        <MotiveImages
          motive={selectedMotive}
          isCreatingNewMotive={isCreatingNewMotive}
          viewMode={view}
          onViewModeChange={setViewMode}
        />
      </div>
      <div className={styles.mobile}>
        Denne siden krever en større skjerm. Åpne den på en datamaskin for å
        fortsette.
      </div>
    </div>
  );
}
