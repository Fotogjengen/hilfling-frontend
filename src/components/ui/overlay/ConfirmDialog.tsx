import { useState, useSyncExternalStore } from "react";
import { alertIcons } from "@/components/ui/display/Alert";
import { Button } from "@/components/ui/input/Button";
import { Dialog } from "./Dialog";
import styles from "./ConfirmDialog.module.css";

type ConfirmSeverity = "error" | "warning" | "info";

interface ConfirmOptions {
  description: string;
  onConfirm: () => unknown;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmState extends ConfirmOptions {
  title: string;
  severity: ConfirmSeverity;
}

let current: ConfirmState | null = null;
const listeners = new Set<() => void>();

function setCurrent(next: ConfirmState | null) {
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function makeConfirm(severity: ConfirmSeverity) {
  return (title: string, options: ConfirmOptions) =>
    setCurrent({ ...options, title, severity });
}

export const confirmDialog = {
  warning: makeConfirm("warning"),
  error: makeConfirm("error"),
  info: makeConfirm("info"),
};

function ConfirmDialogContent({
  title,
  severity,
  description,
  onConfirm,
  confirmLabel = "Bekreft",
  cancelLabel = "Avbryt",
}: ConfirmState) {
  const [isPending, setIsPending] = useState(false);
  const Icon = alertIcons[severity];

  async function handleConfirm() {
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setCurrent(null);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && !isPending && setCurrent(null)}
      title={
        <span className={styles.title}>
          <Icon
            size={20}
            aria-hidden="true"
            className={[styles.icon, styles[severity]].join(" ")}
          />
          {title}
        </span>
      }
      actions={
        <>
          <Button
            variant="neutral"
            disabled={isPending}
            onClick={() => setCurrent(null)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={severity === "error" ? "danger" : "primary"}
            disabled={isPending}
            onClick={void handleConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className={styles.description}>{description}</p>
    </Dialog>
  );
}

export function ConfirmDialogHost() {
  const state = useSyncExternalStore(subscribe, () => current);

  return state && <ConfirmDialogContent {...state} />;
}
