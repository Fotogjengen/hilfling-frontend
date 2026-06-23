import { useId } from "react";
import { Checkbox } from "radix-ui";
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

export function CheckboxField({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: CheckboxProps) {
  const id = useId();

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <Checkbox.Root
        id={id}
        className={styles.checkbox}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      >
        <Checkbox.Indicator className={styles.indicator}>
          {checked === "indeterminate" ? <Minus /> : <Check />}
        </Checkbox.Indicator>
      </Checkbox.Root>

      <div className={styles.text}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>
    </div>
  );
}
