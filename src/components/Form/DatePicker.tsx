import React, { FC } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";

const DatePicker: FC<TextFieldProps> = (props) => {
  return (
    <TextField
      id="datetime"
      type="datetime-local"
      InputLabelProps={{
        shrink: true,
      }}
      {...props}
    />
  );
};

export default DatePicker;
