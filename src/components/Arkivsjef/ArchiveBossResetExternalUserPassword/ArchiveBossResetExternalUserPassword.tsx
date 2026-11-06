import styles from "./ArchiveBossResetExternalUserPassword.module.css";
import { ExternalUserDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { useResetExternalUserPassword } from "@/hooks/externalUser";
import {
  confirmPasswordValidator,
  passwordSchema,
} from "@/utils/form/externalUser";

interface Props {
  user: ExternalUserDto;
  onClose: () => void;
}

function ArchiveBossResetExternalUserPassword({ user, onClose }: Props) {
  const resetPassword = useResetExternalUserPassword();

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) => {
      resetPassword.mutate(
        { id: user.externalUserId.id, password: value.password },
        { onSuccess: onClose },
      );
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"reset_password_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Nytt passord for ${user.username}`}
      actions={
        <Button
          type="submit"
          form={"reset-password-form"}
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending ? "Lagrer..." : "Sett nytt passord"}
        </Button>
      }
    >
      <form
        id="reset-password-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField
            name="password"
            validators={{ onChange: passwordSchema }}
          >
            {(field) => (
              <field.TextInput label="Nytt passord" type="password" autoFocus />
            )}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["password"],
              onChange: confirmPasswordValidator,
            }}
          >
            {(field) => (
              <field.TextInput label="Gjenta passord" type="password" />
            )}
          </form.AppField>
        </div>
      </form>
    </Dialog>
  );
}

export default ArchiveBossResetExternalUserPassword;
