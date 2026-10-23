import { createFileRoute, Outlet } from "@tanstack/react-router";
import styles from "./route.module.css";
import ArchiveBossSidebar from "@/components/Arkivsjef/ArchiveBossSidebar/ArchiveBossSidebar";

export const Route = createFileRoute("/_fgAuthenticated/fg/archiveBoss")({
  component: ArchiveBossLayout,
});

function ArchiveBossLayout() {
  return (
    <div className={styles.archiveBoss}>
      <ArchiveBossSidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
