import React, {
  createContext,
  FC,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormContext, FormProps } from "./types";
import { Box, Grid } from "@material-ui/core";
import SubmitButton from "./SubmitButton";

const Context = createContext<FormContext>({
  values: {},
  errors: {},
  onChange: (_, __) => null,
});

export const useForm = (): FormContext => useContext<FormContext>(Context);

const Form: FC<FormProps> = ({
  initialValues,
  validate,
  onSubmit,
  children,
}) => {
  const [values, setValues] = useState<FormContext["values"]>(initialValues);
  const [errors, setErrors] = useState<FormContext["errors"]>({});

  const validateFields = () => {
    setErrors(validate(values));
  };
  useEffect(() => validateFields(), [values]);

  const onChange = (fieldName: string, value: any) => {
    if (!Object.keys(initialValues).includes(fieldName)) {
      throw new Error(
        "The field that you changed is not registered in the initialValues prop",
      );
    }
    setValues((values) => ({
      ...values,
      [fieldName]: value,
    }));
  };

  const _onSubmit = (e: any) => {
    e.preventDefault();
    setValues(initialValues);
    onSubmit(values);
  };

  return (
    <Context.Provider
      value={{
        values,
        errors,
        onChange,
      }}
    >
      <form onKeyDown={(e) => e.key !== "Enter"}>
        {children}
        <Grid item xs={12}>
          <SubmitButton onClick={(e) => _onSubmit(e)}>Last opp</SubmitButton>
        </Grid>
      </form>
    </Context.Provider>
  );
};

export default Form;