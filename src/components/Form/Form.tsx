import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormContext, FormProps } from "./types";
import { Grid } from "@mui/material";
import SubmitButton from "./SubmitButton";

const Context = createContext<FormContext>({
  values: {},
  errors: {},
  onChange: () => null,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

    // Mark the field as touched when it changes
    if (!touched[fieldName]) {
      setTouched((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }

    setValues((formValues) => ({
      ...formValues,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Mark all fields as touched when attempting to submit
    const allTouched = Object.keys(initialValues).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setTouched(allTouched);

    // Validate one more time before submission
    const validationErrors = validate(values);
    setErrors(validationErrors);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      // Don't proceed with submission if there are errors
      return;
    }

    setIsSubmitting(true);

    onSubmit(values)
      .then((success) => {
        // Only reset form if submission is successful
        if (success) {
          setValues(initialValues);
          setTouched({});
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        // Optionally handle errors here
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Context.Provider
      value={{
        values,
        errors,
        touched,
        onChange,
      }}
    >
      <form onKeyDown={(e) => e.key !== "Enter"}>
        {children}
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <SubmitButton
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              Last opp
            </SubmitButton>
          </Grid>
        </Grid>
      </form>
    </Context.Provider>
  );
};

export default Form;
