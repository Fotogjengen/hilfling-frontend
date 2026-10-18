import { ReactNode } from "react";
import { LayoutGrid, List } from "lucide-react";
import {
  ToggleTabs,
  ToggleTabsList,
  ToggleTabsTrigger,
} from "../ui/input/ToggleTabs";
import styles from "./MotiveImagesTopbar.module.css";

export type ImageViewMode = "grid" | "table";

type MotiveImagesTopbarProps = {
  title: string;
  viewMode: ImageViewMode;
  onViewModeChange: (mode: ImageViewMode) => void;
  children?: ReactNode;
};

export default function MotiveImagesTopbar({
  title,
  viewMode,
  onViewModeChange,
  children,
}: MotiveImagesTopbarProps) {
  return (
    <div className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.controls}>
        {children}
        <ToggleTabs
          value={viewMode}
          onValueChange={(value) =>
            onViewModeChange(value === "table" ? "table" : "grid")
          }
        >
          <ToggleTabsList aria-label="Visningsmodus">
            <ToggleTabsTrigger value="table" aria-label="Tabellvisning">
              <List size={18} />
            </ToggleTabsTrigger>
            <ToggleTabsTrigger value="grid" aria-label="Rutenettvisning">
              <LayoutGrid size={18} />
            </ToggleTabsTrigger>
          </ToggleTabsList>
        </ToggleTabs>
      </div>
    </div>
  );
}
