import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { PopoverRoot, PopoverAnchor, PopoverContent } from "../overlay/Popover";
import styles from "./Combobox.module.css";

interface ComboboxProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getOptionLabel: (option: T) => string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  label,
  placeholder,
  error,
  disabled,
  className,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const selectedLabel = value ? getOptionLabel(value) : "";
  const inputValue = open ? query : selectedLabel;

  const filtered = query
    ? options.filter((o) =>
        getOptionLabel(o).toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  useEffect(() => {
    if (open && inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleSelect = (option: T) => {
    onChange(option);
    handleClose();
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
            onPointerDown={(e) => {
              if (disabled) return;
              if (e.target === inputRef.current) {
                if (!open) {
                  e.preventDefault();
                  inputRef.current.focus();
                  setQuery("");
                  setOpen(true);
                }
                return;
              }
              e.preventDefault();
              if (open) {
                handleClose();
              } else {
                setQuery("");
                setOpen(true);
                inputRef.current?.focus();
              }
            }}
          >
            <input
              ref={inputRef}
              className={styles.input}
              value={inputValue}
              placeholder={placeholder}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              disabled={disabled}
            />
            <ChevronDown size={16} className={styles.chevron} />
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
            handleClose();
          }}
        >
          {filtered.length === 0 ? (
            <div className={styles.empty}>Ingen treff</div>
          ) : (
            filtered.map((option, index) => (
              <button
                key={index}
                ref={
                  value && value === option
                    ? (el) => el?.scrollIntoView({ block: "nearest" })
                    : null
                }
                className={[
                  styles.option,
                  value && value === option ? styles.selected : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
              >
                {getOptionLabel(option)}
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
