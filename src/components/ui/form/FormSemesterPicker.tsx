import { useFieldContext } from "@/contexts/FormContext";
import { getFieldErrorMessage } from "@/utils/form/getFieldErrorMessage";
import { SemesterPicker } from "../input/SemesterPicker";

interface FormSemesterPickerProps {
  label?: string;
  placeholder?: string;
  allowEmpty?: boolean;
  hint?: string;
}

export function FormSemesterPicker({
  label,
  placeholder,
  allowEmpty,
  hint,
}: FormSemesterPickerProps) {
  const field = useFieldContext<string>();

  return (
    <SemesterPicker
      name={field.name}
      value={field.state.value}
      onChange={(v: string) => field.handleChange(v)}
      onBlur={() => field.handleBlur()}
      label={label}
      placeholder={placeholder}
      allowEmpty={allowEmpty}
      hint={hint}
      error={getFieldErrorMessage(field.state.meta.errors[0])}
    />
  );
}
