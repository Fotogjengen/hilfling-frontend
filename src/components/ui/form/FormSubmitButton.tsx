import { useFormContext } from "@/contexts/FormContext";
import { Button } from "../input/Button";
import { Spinner } from "@/components/Icons/Spinner";

interface FormSubmitButtonProps {
  label?: string;
  className?: string;
}

export function FormSubmitButton({
  label = "Submit",
  className,
}: FormSubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} className={className}>
          {isSubmitting ? <Spinner /> : label}
        </Button>
      )}
    </form.Subscribe>
  );
}
