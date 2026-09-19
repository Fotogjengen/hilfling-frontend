import { Dialog } from "@/components/ui/overlay/Dialog";
import styles from "./PhotoGangBangerHelpDialog.module.css";

interface PhotoGangBangerHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoGangBangerHelpDialog({
  open,
  onOpenChange,
}: PhotoGangBangerHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Er du fotogjenger?">
      <p className={styles.intro}>
        Buuuu, nå har ikke gjengsjef gjort jobben sin😡
      </p>
      <ol className={styles.steps}>
        <li className={styles.step}>
          <span className={styles.stepNumber} aria-hidden="true">
            1
          </span>
          <div className={styles.stepContent}>
            <span className={styles.stepTitle}>
              Send inn en daddel til gjengsjef
            </span>
            <p className={styles.stepText}>
              Dette er det første og viktigste steget.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNumber} aria-hidden="true">
            2
          </span>
          <div className={styles.stepContent}>
            <span className={styles.stepTitle}>
              Be gjengsjef legge deg til som FG bruker
            </span>
            <p className={styles.stepText}>
              Dette er det andre og nest viktigste steget.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNumber} aria-hidden="true">
            3
          </span>
          <div className={styles.stepContent}>
            <span className={styles.stepTitle}>Logg deg ut og inn igjen</span>
            <p className={styles.stepText}>
              Etter gjengsjef har lagt deg til som FGer, må du logge deg ut og
              inn igjen. Da skal du ha alle tilgangene du trenger :)
            </p>
          </div>
        </li>
      </ol>
    </Dialog>
  );
}
