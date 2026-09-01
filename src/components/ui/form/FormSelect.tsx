import { useFieldContext } from "@/utils/form/FormContext";
import { Select } from "../input/Select";

interface FormSelectProps {
  options: { label: string; value: string }[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormSelect({
  options,
  label,
  placeholder,
  disabled,
}: FormSelectProps) {
  const field = useFieldContext<string>();

  return (
    <Select
      name={field.name}
      options={options}
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      disabled={disabled}
      onValueChange={(v) => field.handleChange(v)}
      error={field.state.meta.errors[0]?.toString()}
    />
  );
}
