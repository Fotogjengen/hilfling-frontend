import { useFieldContext } from "@/contexts/FormContext";
import { getFieldErrorMessage } from "@/utils/form/getFieldErrorMessage";
import { TextInput } from "../input/TextInput";

interface FormTextInputProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  autoFocus?: boolean;
  type?: "text" | "password" | "email";
}

export function FormTextInput({
  label,
  hint,
  placeholder,
  autoFocus,
  type,
}: FormTextInputProps) {
  const field = useFieldContext<string>();

  return (
    <TextInput
      name={field.name}
      type={type}
      label={label}
      hint={hint}
      placeholder={placeholder}
      autoFocus={autoFocus}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={getFieldErrorMessage(field.state.meta.errors[0])}
    />
  );
}
