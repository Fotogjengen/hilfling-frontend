import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { FormTextInput } from "@/components/ui/form/FormTextInput";
import { FormCheckbox } from "@/components/ui/form/FormCheckbox";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";
import { FormSelect } from "@/components/ui/form/FormSelect";
import { FormDatePicker } from "@/components/ui/form/FormDatePicker";
import { FormSemesterPicker } from "@/components/ui/form/FormSemesterPicker";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput: FormTextInput,
    Checkbox: FormCheckbox,
    Select: FormSelect,
    DatePicker: FormDatePicker,
    SemesterPicker: FormSemesterPicker,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
});

export default useAppForm;
