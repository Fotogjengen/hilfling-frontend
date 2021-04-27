import { FieldRenderProps } from "react-final-form";
import { FormControlProps } from "@material-ui/core";

export interface FormHelperTextWrapperProps<T> extends FieldRenderProps<T> {
  label: string;
  formControlProps: FormControlProps;
}
