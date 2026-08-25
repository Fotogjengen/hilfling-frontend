import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/input/Button";
import styles from "./gangBangers.module.css";

export const Route = createFileRoute("/_fgAuthenticated/fg/gang_bangers/")({
  component: GangBangers,
});

function GangBangers() {
  return (
    <div className={styles.gangBangers}>
      <h2>Gang bangers</h2>

      <div className={styles.users}>
        <Button disabled>Lag bruker</Button>
        <Button disabled>Brukere</Button>
      </div>
    </div>
  );
}
