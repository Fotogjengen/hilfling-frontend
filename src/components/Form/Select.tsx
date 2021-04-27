import React, { FC } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select as MuiSelect,
} from "@material-ui/core";
import cx from "classnames";
import styles from "../../views/Intern/PhotoUpload/PhotoUpload.module.css";
import { FormHelperTextWrapperProps } from "./types";

const Select: FC<FormHelperTextWrapperProps<typeof MuiSelect>> = ({
  input: { name, value, onChange, ...restInput },
  meta,
  formControlProps,
  label,
  ...rest
}) => {
  return (
    <FormControl {...formControlProps} className={cx(styles.rootFormControl)}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <MuiSelect
        {...rest}
        name={name}
        onChange={onChange}
        inputProps={restInput}
        value={value}
      />
      {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
