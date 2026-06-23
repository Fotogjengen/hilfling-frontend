import { useFieldContext } from "@/utils/form/FormContext";
import { SelectField } from "../input/Select";

interface FormSelectProps {
  options: { label: string; value: string }[];
  label?: string;
  placeholder?: string;
}

export function FormSelect({ options, label, placeholder }: FormSelectProps) {
  const field = useFieldContext<string>();

  return (
    <SelectField
      options={options}
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      onValueChange={(v) => field.handleChange(v)}
      error={field.state.meta.errors[0]?.toString()}
    />
  );
}
