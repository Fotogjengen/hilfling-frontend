import React, { FC, useState } from "react";
import {
  FormControl,
  FormHelperText,
  TextField as MuiTextField,
  TextFieldProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormFieldProps } from "./types";
import { useForm } from "./Form";

const ErrorText = styled(FormHelperText)({
  color: "red",
});

let idCount = 0;

const TextField: FC<FormFieldProps<TextFieldProps>> = ({
  name,
  label,
  fullWidth,
}) => {
  const { errors, onChange, values } = useForm();
  const [touched, setTouched] = useState<boolean>(false);
  const id = `Select-${name}-${idCount++}`;
  const error = touched && errors[name];
  return (
    <FormControl fullWidth={fullWidth} id={id}>
      <MuiTextField
        label={label}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => setTouched(true)}
        value={values[name]}
      />
      <ErrorText>{error}</ErrorText>
    </FormControl>
  );
};

export default TextField;
