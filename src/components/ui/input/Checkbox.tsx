import { useId } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check, Minus } from "lucide-react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  label?: string;
  description?: string;
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: CheckboxProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
    >
      <CheckboxPrimitive.Root
        id={id}
        className={styles.checkbox}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      >
        <CheckboxPrimitive.Indicator className={styles.indicator}>
          {checked === "indeterminate" ? <Minus /> : <Check />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <div className={styles.text}>
        {label && <span className={styles.label}>{label}</span>}
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>
    </label>
  );
}
