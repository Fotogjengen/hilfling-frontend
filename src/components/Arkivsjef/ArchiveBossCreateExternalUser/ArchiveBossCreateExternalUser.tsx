import styles from "./ArchiveBossCreateExternalUser.module.css";
import { Button } from "@/components/ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { SecurityLevelDto } from "@/../generated";
import { useCreateExternalUser } from "@/hooks/externalUser";
import {
  confirmPasswordValidator,
  externalUserSchema,
  passwordSchema,
  securityLevelOptions,
} from "@/utils/form/externalUser";

interface Props {
  onClose: () => void;
}

function ArchiveBossCreateExternalUser({ onClose }: Props) {
  const createUser = useCreateExternalUser();

  const form = useAppForm({
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      securityLevel: SecurityLevelDto.securityLevelType.ALLE,
      description: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) => {
      const user = externalUserSchema.parse(value);
      createUser.mutate(
        {
          username: user.username,
          fullName: user.fullName || null,
          email: user.email || null,
          securityLevel: { securityLevelType: user.securityLevel },
          description: user.description || null,
          password: value.password,
          isActive: true,
        },
        { onSuccess: onClose },
      );
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"new_external_user_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Opprett ekstern bruker`}
      actions={
        <Button
          type="submit"
          form={"new-external-user-form"}
          disabled={createUser.isPending}
        >
          {createUser.isPending ? "Oppretter..." : "Opprett"}
        </Button>
      }
    >
      <form
        id="new-external-user-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField
            name="username"
            validators={{ onChange: externalUserSchema.shape.username }}
          >
            {(field) => <field.TextInput label="Brukernavn" autoFocus />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField
            name="fullName"
            validators={{ onChange: externalUserSchema.shape.fullName }}
          >
            {(field) => <field.TextInput label="Fullt navn (valgfritt)" />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField
            name="email"
            validators={{ onChange: externalUserSchema.shape.email }}
          >
            {(field) => (
              <field.TextInput label="E-post (valgfritt)" type="email" />
            )}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField name="securityLevel">
            {(field) => (
              <field.Select
                label="Tilgangsnivå"
                options={securityLevelOptions}
              />
            )}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField name="description">
            {(field) => <field.TextInput label="Beskrivelse (valgfritt)" />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField
            name="password"
            validators={{ onChange: passwordSchema }}
          >
            {(field) => <field.TextInput label="Passord" type="password" />}
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

export default ArchiveBossCreateExternalUser;
