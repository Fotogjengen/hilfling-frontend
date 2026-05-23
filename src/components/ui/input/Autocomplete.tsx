import { useState, useRef } from "react";
import styles from "./Autocomplete.module.css";
import { PopoverAnchor, PopoverContent, PopoverRoot } from "../overlay/Popover";

interface AutocompleteProps {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Autocomplete({
  suggestions,
  value,
  onChange,
  label,
  placeholder,
  error,
  disabled,
  className,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const filtered = value
    ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
    : suggestions;

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      {label && (
        <label
          className={[styles.label, disabled ? styles.labelDisabled : null]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </label>
      )}
      <PopoverRoot open={open} onOpenChange={(o) => !disabled && setOpen(o)}>
        <PopoverAnchor asChild>
          <div
            ref={anchorRef}
            className={[
              styles.trigger,
              error ? styles.triggerError : null,
              disabled ? styles.triggerDisabled : null,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              ref={inputRef}
              className={styles.input}
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => !disabled && setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  inputRef.current?.blur();
                }
                e.stopPropagation();
              }}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            const target = (e as CustomEvent).detail?.originalEvent
              ?.target as Node | null;
            if (target && anchorRef.current?.contains(target)) {
              e.preventDefault();
              return;
            }
            setOpen(false);
          }}
        >
          {filtered.length === 0 ? (
            <div className={styles.empty}>Ingen treff</div>
          ) : (
            filtered.map((suggestion) => (
              <button
                key={suggestion}
                className={[
                  styles.option,
                  suggestion === value ? styles.selected : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))
          )}
        </PopoverContent>
      </PopoverRoot>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
