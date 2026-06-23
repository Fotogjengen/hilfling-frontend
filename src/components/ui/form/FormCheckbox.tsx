import { useFieldContext } from "@/utils/form/FormContext";
import { CheckboxField } from "../input/Checkbox";

interface FormCheckboxProps {
  label?: string;
  description?: string;
}

export function FormCheckbox({ label, description }: FormCheckboxProps) {
  const field = useFieldContext<boolean>();

  return (
    <CheckboxField
      label={label}
      description={description}
      checked={field.state.value}
      onCheckedChange={(checked) => field.handleChange(checked as boolean)}
      disabled={false}
    />
  );
}
