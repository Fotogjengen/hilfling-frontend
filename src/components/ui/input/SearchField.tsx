import { InputHTMLAttributes, useId } from "react";
import { Search, X } from "lucide-react";
import styles from "./SearchField.module.css";

interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> {
  value: string;
  onClear?: () => void;
  className?: string;
}

export function SearchField({
  value,
  onClear,
  className,
  disabled,
  id,
  ...props
}: SearchFieldProps) {
  const generatedId = useId();

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <input
        id={id ?? `search-field-${generatedId}`}
        type="text"
        value={value}
        disabled={disabled}
        className={styles.input}
        {...props}
      />
      {value ? (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
          disabled={disabled}
          aria-label="Tøm søk"
        >
          <X size={16} />
        </button>
      ) : (
        <span className={styles.icon}>
          <Search size={16} />
        </span>
      )}
    </div>
  );
}
