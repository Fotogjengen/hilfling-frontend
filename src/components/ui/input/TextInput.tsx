import { Label } from "radix-ui";
import styles from "./TextInput.module.css";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, error, hint, className, id, prefix, suffix, ...props },
    ref,
  ) {
    const inputId = id ?? `text-input-${props.name}`;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
        {label && (
          <Label.Root className={styles.label} htmlFor={inputId}>
            {label}
          </Label.Root>
        )}
        <div
          className={[styles.inputRow, error ? styles.inputRowError : null]
            .filter(Boolean)
            .join(" ")}
        >
          {prefix && <div className={styles.prefix}>{prefix}</div>}
          <input
            ref={ref}
            id={inputId}
            autoComplete="off"
            className={styles.input}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />
          {suffix && <div className={styles.suffix}>{suffix}</div>}
        </div>
        {hint && !error && (
          <span id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </span>
        )}
        {error && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);
