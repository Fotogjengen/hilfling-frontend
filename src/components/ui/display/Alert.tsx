import { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import styles from "./Alert.module.css";

type AlertSeverity = "error" | "warning" | "info" | "success";

type AlertProps = {
  severity?: AlertSeverity;
  title?: string;
  children?: ReactNode;
  className?: string;
};

export const alertIcons = {
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
  success: CircleCheck,
};

export function Alert({
  severity = "info",
  title,
  children,
  className,
}: AlertProps) {
  const Icon = alertIcons[severity];

  return (
    <div
      role={severity === "error" || severity === "warning" ? "alert" : "status"}
      className={[styles.alert, styles[severity], className]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon size={18} aria-hidden="true" className={styles.icon} />
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <p className={styles.description}>{children}</p>}
      </div>
    </div>
  );
}
