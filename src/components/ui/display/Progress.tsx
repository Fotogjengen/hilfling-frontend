import { Progress as ProgressPrimitive } from "radix-ui";
import styles from "./Progress.module.css";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <ProgressPrimitive.Root
      className={[styles.track, className].filter(Boolean).join(" ")}
      value={clamped}
      max={100}
    >
      <ProgressPrimitive.Indicator
        className={styles.indicator}
        style={{ transform: `scaleX(${clamped / 100})` }}
      />
    </ProgressPrimitive.Root>
  );
}
