import React, { FC } from "react";
import { FieldRenderProps } from "react-final-form";
import { Checkbox as MuiCheckbox } from "@material-ui/core";

const Checkbox: FC<FieldRenderProps<typeof MuiCheckbox>> = ({
  input: { checked, name, onChange, restInput },
  ...rest
}) => {
  return (
    <MuiCheckbox
      {...rest}
      name={name}
      inputProps={restInput}
      onChange={onChange}
      checked={checked}
    />
  );
};

export default Checkbox;
