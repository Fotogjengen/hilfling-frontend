import { useFormContext } from "@/utils/form/FormContext";
import { Button } from "../input/Button";
import { Spinner } from "@/components/Icons/Spinner";

interface FormSubmitButtonProps {
  label?: string;
}

export function FormSubmitButton({ label = "Submit" }: FormSubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : label}
        </Button>
      )}
    </form.Subscribe>
  );
}
