import styles from "./ArchiveBossEditExternalUserSchema.module.css";
import { ExternalUserDto, SecurityLevelDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import type { EditSchemaProps } from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import {
  externalUserSchema,
  securityLevelOptions,
} from "@/utils/form/externalUser";

function ArchiveBossEditExternalUserSchema({
  dtoObject: user,
  onClose,
  onPatch,
}: EditSchemaProps<ExternalUserDto>) {
  const form = useAppForm({
    defaultValues: {
      username: user.username,
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      securityLevel:
        user.securityLevel?.securityLevelType ??
        SecurityLevelDto.securityLevelType.ALLE,
      description: user.description ?? "",
      isActive: user.isActive,
    },
    onSubmit: ({ value }) => {
      const parsed = externalUserSchema.parse(value);
      onPatch({
        ...user,
        username: parsed.username,
        fullName: parsed.fullName,
        email: parsed.email,
        securityLevel: { securityLevelType: parsed.securityLevel },
        description: parsed.description,
        isActive: value.isActive,
      });
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"edit_external_user_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${user.username}`}
      actions={
        <Button type="submit" form={"edit-external-user-form"}>
          Lagre endringer
        </Button>
      }
    >
      <form
        id="edit-external-user-form"
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
            {(field) => <field.TextInput label="Fullt navn" />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField
            name="email"
            validators={{ onChange: externalUserSchema.shape.email }}
          >
            {(field) => <field.TextInput label="E-post" type="email" />}
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
            {(field) => <field.TextInput label="Beskrivelse" />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField name="isActive">
            {(field) => (
              <field.Checkbox
                label="Aktiv"
                description="Deaktiverte brukere kan ikke logge inn"
              />
            )}
          </form.AppField>
        </div>
      </form>
    </Dialog>
  );
}

export default ArchiveBossEditExternalUserSchema;
