import { ComponentProps } from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import styles from "./Toast.module.css";

export function ToastProvider(
  props: ComponentProps<typeof ToastPrimitive.Provider>,
) {
  return <ToastPrimitive.Provider {...props} />;
}

export function ToastViewport({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={[styles.viewport, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

type Severity = "error" | "warning" | "info" | "success";

interface ToastProps extends ComponentProps<typeof ToastPrimitive.Root> {
  severity?: Severity;
}

export function Toast({ className, severity, ...props }: ToastProps) {
  return (
    <ToastPrimitive.Root
      className={[styles.root, severity ? styles[severity] : null, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function ToastClose({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      className={[styles.close, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
