import { useFieldContext } from "@/utils/form/FormContext";
import { TextInput } from "../input/TextInput";

interface FormTextInputProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function FormTextInput({
  label,
  hint,
  placeholder,
  autoFocus,
}: FormTextInputProps) {
  const field = useFieldContext<string>();

  return (
    <TextInput
      label={label}
      hint={hint}
      placeholder={placeholder}
      autoFocus={autoFocus}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={field.state.meta.errors[0]?.toString()}
    />
  );
}
