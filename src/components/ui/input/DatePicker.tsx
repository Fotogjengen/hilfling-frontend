import { useId, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Matcher } from "react-day-picker";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "../overlay/Popover";
import styles from "./DatePicker.module.css";
import { Calendar } from "../display/Calendar";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** Dates the user is not allowed to pick, e.g. `{ after: maxDate }`. */
  disabledDates?: Matcher | Matcher[];
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Velg dato",
  error,
  disabled,
  disabledDates,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const labelId = `${triggerId}-label`;
  const valueId = `${triggerId}-value`;
  const errorId = `${triggerId}-error`;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      {label && (
        <label id={labelId} htmlFor={triggerId} className={styles.label}>
          {label}
        </label>
      )}
      <PopoverRoot open={open} onOpenChange={(o) => !disabled && setOpen(o)}>
        <PopoverTrigger asChild>
          <button
            id={triggerId}
            type="button"
            aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={[
              styles.trigger,
              error ? styles.triggerError : null,
              disabled ? styles.triggerDisabled : null,
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={disabled}
          >
            <span
              id={valueId}
              className={value ? styles.value : styles.placeholder}
            >
              {value ? format(value, "dd.MM.yyyy") : placeholder}
            </span>
            <CalendarIcon size={16} aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          scrollable={false}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
        >
          <Calendar
            selected={value}
            disabled={disabledDates}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </PopoverRoot>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
