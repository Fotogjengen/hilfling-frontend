import { useFieldContext } from "@/utils/form/FormContext";
import { TextInput } from "../input/TextInput";

interface FormTextInputProps {
  label?: string;
  hint?: string;
  placeholder?: string;
}

export function FormTextInput({
  label,
  hint,
  placeholder,
}: FormTextInputProps) {
  const field = useFieldContext<string>();

  return (
    <TextInput
      label={label}
      hint={hint}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={field.state.meta.errors[0]?.toString()}
    />
  );
}
