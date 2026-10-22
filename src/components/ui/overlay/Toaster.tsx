import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/input/IconButton";
import { Progress } from "@/components/ui/display/Progress";
import styles from "./Toaster.module.css";

const TOAST_DURATION = 5000;

interface ToastOptions {
  description?: string;
  id?: string | number;
}

interface ProgressToastOptions extends ToastOptions {
  value: number;
}

type ToastType = "default" | "success" | "error" | "warning" | "info";

interface ToastItemProps {
  id: string | number;
  title: string;
  description?: string;
  type: ToastType;
  progress?: number;
}

function ToastItem({ id, title, description, type, progress }: ToastItemProps) {
  return (
    <div
      className={[styles.toast, type !== "default" && styles[type]]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
        {progress !== undefined && (
          <Progress value={progress} className={styles.progress} />
        )}
      </div>
      {progress === undefined && (
        <IconButton
          variant="subtle"
          size="sm"
          aria-label="Lukk"
          className={styles.closeButton}
          onClick={() => sonnerToast.dismiss(id)}
        >
          <X size={14} />
        </IconButton>
      )}
    </div>
  );
}

function makeToast(type: ToastType) {
  return (title: string, options?: ToastOptions) =>
    sonnerToast.custom(
      (id) => (
        <ToastItem
          id={id}
          title={title}
          description={options?.description}
          type={type}
        />
      ),
      { id: options?.id, duration: TOAST_DURATION },
    );
}

function progressToast(title: string, options: ProgressToastOptions) {
  return sonnerToast.custom(
    (id) => (
      <ToastItem
        id={id}
        title={title}
        description={options.description}
        type="default"
        progress={options.value}
      />
    ),
    { id: options.id, duration: Infinity },
  );
}

export const toast = Object.assign(makeToast("default"), {
  success: makeToast("success"),
  error: makeToast("error"),
  warning: makeToast("warning"),
  info: makeToast("info"),
  progress: progressToast,
  dismiss: sonnerToast.dismiss,
});

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{ duration: TOAST_DURATION }}
    />
  );
}
