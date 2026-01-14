import React, { FC, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select as MuiSelect,
  SelectProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormFieldProps } from "./types";
import { useForm } from "./Form";

const ErrorText = styled(FormHelperText)({
  color: "red",
});

let idCount = 0;

const Select: FC<FormFieldProps<SelectProps>> = ({
  name,
  label,
  fullWidth,
  children,
  ...rest
}) => {
  const { values, errors, onChange } = useForm();
  const [touched, setTouched] = useState<boolean>(false);
  const id = `Select-${name}-${idCount++}`;
  const error = touched && errors[name];
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={`${id}-label-id`} htmlFor={name}>
        {label}
      </InputLabel>
      <MuiSelect
        id={id}
        labelId={`${id}-label-id`}
        name={name}
        label={label}
        onChange={(e) => onChange(name, e.target.value)}
        value={values[name]}
        onBlur={() => setTouched(true)}
        {...rest}
      >
        {children}
      </MuiSelect>
      <ErrorText>{error}</ErrorText>
    </FormControl>
  );
};

export default Select;
