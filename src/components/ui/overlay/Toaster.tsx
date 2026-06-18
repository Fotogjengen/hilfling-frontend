import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/input/IconButton";
import styles from "./Toaster.module.css";

interface ToastOptions {
  description?: string;
}

type ToastType = "default" | "success" | "error" | "warning" | "info";

interface ToastItemProps {
  id: string | number;
  title: string;
  description?: string;
  type: ToastType;
}

function ToastItem({ id, title, description, type }: ToastItemProps) {
  return (
    <div
      className={[styles.toast, type !== "default" && styles[type]]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <IconButton
        variant="subtle"
        size="sm"
        aria-label="Lukk"
        className={styles.closeButton}
        onClick={() => sonnerToast.dismiss(id)}
      >
        <X size={14} />
      </IconButton>
    </div>
  );
}

function makeToast(type: ToastType) {
  return (title: string, options?: ToastOptions) =>
    sonnerToast.custom((id) => (
      <ToastItem
        id={id}
        title={title}
        description={options?.description}
        type={type}
      />
    ));
}

export const toast = Object.assign(makeToast("default"), {
  success: makeToast("success"),
  error: makeToast("error"),
  warning: makeToast("warning"),
  info: makeToast("info"),
  dismiss: sonnerToast.dismiss,
});

export function Toaster() {
  return (
    <SonnerToaster position="bottom-right" toastOptions={{ duration: 5000 }} />
  );
}
