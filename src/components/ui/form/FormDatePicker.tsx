import { useFieldContext } from "@/utils/form/FormContext";
import { getFieldErrorMessage } from "@/utils/form/getFieldErrorMessage";
import { DatePicker } from "../input/DatePicker";

interface FormDatePickerProps {
  label?: string;
  placeholder?: string;
}

export function FormDatePicker({ label, placeholder }: FormDatePickerProps) {
  const field = useFieldContext<Date | undefined>();

  return (
    <DatePicker
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(date) => field.handleChange(date)}
      error={getFieldErrorMessage(field.state.meta.errors[0])}
    />
  );
}
