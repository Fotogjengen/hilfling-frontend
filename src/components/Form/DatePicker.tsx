// DatePickerField.tsx
import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useForm } from "./Form";

interface DatePickerFieldProps {
  name: string;
  label: string;
  required?: boolean;
  fullWidth?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  label,
  required = false,
  fullWidth = false,
}) => {
  const { values, errors, touched, onChange } = useForm();

  return (
    <DatePicker
      label={label}
      value={values[name] ? dayjs(values[name]) : null}
      onChange={(newValue) => onChange(name, newValue?.toDate())}
      slotProps={{
        textField: {
          fullWidth: fullWidth,
          required: required,
          error: !!(errors[name] && touched?.[name]),
          helperText: (touched?.[name] && errors[name]) || " ",
        },
      }}
    />
  );
};

export default DatePickerField;
