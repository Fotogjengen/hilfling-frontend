import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  useGroupRef,
} from "react-resizable-panels";
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

const DEFAULT_SIDEBAR_LAYOUTS = {
  empty: { selector: 80, details: 20 },
  motiveSelected: { selector: 30, details: 70 },
};

function PhotoUpload() {
  const { motive, view = "grid", creating } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const isCreatingNewMotive = creating === true;
  const motiveId = isCreatingNewMotive ? undefined : motive;
  const { data: selectedMotive = null, isError } = useMotive(motiveId);

  const sidebarRef = useGroupRef();
  const horizontalLayout = useDefaultLayout({
    id: "upload-horizontal",
    onlySaveAfterUserInteractions: true,
  });
  const emptySidebarLayout = useDefaultLayout({
    id: "upload-sidebar-empty",
    onlySaveAfterUserInteractions: true,
  });
  const motiveSelectedSidebarLayout = useDefaultLayout({
    id: "upload-sidebar-motive-selected",
    onlySaveAfterUserInteractions: true,
  });
  const hasMotive = motiveId !== undefined || isCreatingNewMotive;
  const sidebarLayout = hasMotive
    ? motiveSelectedSidebarLayout
    : emptySidebarLayout;
  const defaultSidebarLayout = hasMotive
    ? DEFAULT_SIDEBAR_LAYOUTS.motiveSelected
    : DEFAULT_SIDEBAR_LAYOUTS.empty;

  const previousHasMotive = useRef(hasMotive);
  useEffect(() => {
    if (previousHasMotive.current === hasMotive) return;
    previousHasMotive.current = hasMotive;
    sidebarRef.current?.setLayout(
      sidebarLayout.defaultLayout ?? defaultSidebarLayout,
    );
  }, [
    hasMotive,
    sidebarRef,
    sidebarLayout.defaultLayout,
    defaultSidebarLayout,
  ]);

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
      <Group
        className={styles.panels}
        orientation="horizontal"
        defaultLayout={horizontalLayout.defaultLayout}
        onLayoutChanged={horizontalLayout.onLayoutChanged}
      >
        <Panel
          id="sidebar"
          className={styles.sideBar}
          defaultSize="25%"
          minSize="15%"
          maxSize="50%"
        >
          <Group
            className={styles.sideBarPanels}
            orientation="vertical"
            groupRef={sidebarRef}
            defaultLayout={sidebarLayout.defaultLayout ?? defaultSidebarLayout}
            onLayoutChanged={sidebarLayout.onLayoutChanged}
          >
            <Panel id="selector" className={styles.sideBarPanel} minSize="15%">
              <MotiveSelector
                value={selectedMotive}
                isCreatingNew={isCreatingNewMotive}
                onChange={selectMotive}
                onCreateNew={startCreatingMotive}
              />
            </Panel>
            <Separator className={styles.separatorHorizontal} />
            <Panel id="details" className={styles.sideBarPanel} minSize="15%">
              <MotiveDetails
                motive={selectedMotive}
                isCreatingNew={isCreatingNewMotive}
                onSaved={selectMotive}
                onCancel={() => selectMotive(null)}
                onCreateNew={startCreatingMotive}
              />
            </Panel>
          </Group>
        </Panel>
        <Separator className={styles.separatorVertical} />
        <Panel id="main" className={styles.mainContent} minSize="30%">
          <MotiveImages
            motive={selectedMotive}
            isCreatingNewMotive={isCreatingNewMotive}
            viewMode={view}
            onViewModeChange={setViewMode}
          />
        </Panel>
      </Group>
      <div className={styles.mobile}>
        Denne siden krever en større skjerm. Åpne den på en datamaskin for å
        fortsette.
      </div>
    </div>
  );
}
