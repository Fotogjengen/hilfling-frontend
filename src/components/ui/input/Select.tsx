import { Select as SelectPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { useId } from "react";
import styles from "./Select.module.css";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function Select({
  options,
  value,
  onValueChange,
  label,
  placeholder,
  error,
  disabled,
  className,
  id,
  name,
}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? `select-${generatedId}`;
  const labelId = `${triggerId}-label`;
  const valueId = `${triggerId}-value`;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      {label && (
        <label id={labelId} className={styles.label} htmlFor={triggerId}>
          {label}
        </label>
      )}
      <SelectPrimitive.Root
        name={name}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={triggerId}
          aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${triggerId}-error` : undefined}
          className={[styles.trigger, error ? styles.triggerError : null]
            .filter(Boolean)
            .join(" ")}
        >
          <SelectPrimitive.Value id={valueId} placeholder={placeholder} />
          <ChevronDown
            size={16}
            className={styles.chevron}
            aria-hidden="true"
          />
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={styles.content}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={styles.item}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && (
        <span id={`${triggerId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
