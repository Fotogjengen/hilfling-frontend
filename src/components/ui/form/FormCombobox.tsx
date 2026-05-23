import { useFieldContext } from "@/utils/form/FormContext";
import { Combobox } from "../input/Combobox";

interface FormComboboxProps<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  label?: string;
  placeholder?: string;
}

export function FormCombobox<T>({
  options,
  getOptionLabel,
  label,
  placeholder,
}: FormComboboxProps<T>) {
  const field = useFieldContext<T | null>();

  return (
    <Combobox
      options={options}
      getOptionLabel={getOptionLabel}
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(v) => field.handleChange(v)}
      error={field.state.meta.errors[0]?.toString()}
    />
  );
}
