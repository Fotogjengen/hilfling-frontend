import { useId } from "react";
import { Switch as SwitchPrimitive, Label } from "radix-ui";
import styles from "./Switch.module.css";

interface SwitchFieldProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: SwitchFieldProps) {
  const id = useId();

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <div className={styles.text}>
        {label && (
          <Label.Root htmlFor={id} className={styles.label}>
            {label}
          </Label.Root>
        )}
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>
      <SwitchPrimitive.Root
        id={id}
        className={styles.root}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      >
        <SwitchPrimitive.Thumb className={styles.thumb} />
      </SwitchPrimitive.Root>
    </div>
  );
}
