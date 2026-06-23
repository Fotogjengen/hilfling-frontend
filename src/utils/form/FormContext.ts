import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { FormTextInput } from "@/components/ui/form/FormTextInput";
import { FormCheckbox } from "@/components/ui/form/FormCheckbox";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";
import { FormSelect } from "@/components/ui/form/FormSelect";
import { FormDatePicker } from "@/components/ui/form/FormDatePicker";

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
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
});

export default useAppForm;
