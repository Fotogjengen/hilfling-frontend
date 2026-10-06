import { useCallback, useState, forwardRef, useEffect } from "react";
import { TextInput } from "./TextInput";
import { isValidSemester, normalizeSemester } from "@/utils/semester";
import type { TextInputProps } from "./TextInput";

export interface SemesterPickerProps
  extends Omit<TextInputProps, "value" | "onChange" | "onBlur"> {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  allowEmpty?: boolean;
}

export const SemesterPicker = forwardRef<HTMLInputElement, SemesterPickerProps>(
  function SemesterPicker(
    { value, onChange, onBlur, allowEmpty = false, error, ...rest },
    ref,
  ) {
    const [dirtyValue, setDirtyValue] = useState(value);

    // Sync internal display value when the external prop changes.
    useEffect(() => {
      setDirtyValue(value);
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value.toUpperCase();
        setDirtyValue(next);
        onChange(next);
      },
      [onChange],
    );

    const handleBlur = useCallback(() => {
      const normalized = normalizeSemester(dirtyValue);
      if (normalized !== dirtyValue) {
        setDirtyValue(normalized);
        onChange(normalized);
      }
      onBlur?.();
    }, [dirtyValue, onChange, onBlur]);

    const hasValue = dirtyValue.trim().length > 0;
    const isValid =
      allowEmpty && !hasValue ? true : isValidSemester(dirtyValue);
    const displayError =
      error || (!isValid && hasValue
        ? "Ugyldig semester (format: V25 eller H25)"
        : undefined);

    return (
      <TextInput
        ref={ref}
        {...rest}
        value={dirtyValue}
        onChange={handleChange}
        onBlur={handleBlur}
        error={displayError}
        autoComplete="off"
        spellCheck="false"
      />
    );
  },
);
