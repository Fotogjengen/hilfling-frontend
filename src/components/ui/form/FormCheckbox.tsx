import { useFieldContext } from "@/utils/form/FormContext";
import { Checkbox } from "../input/Checkbox";

interface FormCheckboxProps {
  label?: string;
  description?: string;
}

export function FormCheckbox({ label, description }: FormCheckboxProps) {
  const field = useFieldContext<boolean>();

  return (
    <Checkbox
      label={label}
      description={description}
      checked={field.state.value}
      onCheckedChange={(checked) => field.handleChange(checked as boolean)}
      disabled={false}
    />
  );
}
