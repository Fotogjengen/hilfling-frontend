import { z } from "zod";
import type { PhotoGangBangerDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { toast } from "@/components/ui/overlay/Toaster";
import { useUpdatePhotoGangBanger } from "@/hooks/photoGangBangers";
import useAppForm from "@/utils/form/FormContext";
import styles from "./EditPhotoGangBangerDialog.module.css";

interface EditPhotoGangBangerDialogProps {
  user: PhotoGangBangerDto;
  onClose: () => void;
}

const schema = z.object({
  firstName: z.string().trim().min(1, "Fornavn er obligatorisk"),
  lastName: z.string().trim().min(1, "Etternavn er obligatorisk"),
  phoneNumber: z.string().regex(/^[1-9]\d{7}$/, "Ugyldig telefonnummer"),
  email: z.string().email("Ugyldig e-postadresse"),
  isActive: z.boolean(),
  isPang: z.boolean(),
});

export function EditPhotoGangBangerDialog({
  user,
  onClose,
}: EditPhotoGangBangerDialogProps) {
  const updateUser = useUpdatePhotoGangBanger();
  const formId = `edit-photo-gang-banger-${user.photoGangBangerId.id}`;
  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.username;

  const form = useAppForm({
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      email: user.email ?? "",
      isActive: user.isActive ?? false,
      isPang: user.isPang ?? false,
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      try {
        await updateUser.mutateAsync({ ...user, ...value });
        toast.success("Brukeren ble oppdatert");
        onClose();
      } catch (error) {
        toast.error("Kunne ikke oppdatere brukeren", {
          description: error instanceof Error ? error.message : "Ukjent feil",
        });
      }
    },
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !updateUser.isPending) onClose();
      }}
      title={`Rediger ${fullName}`}
      actions={
        <>
          <Button
            type="button"
            variant="neutral"
            onClick={onClose}
            disabled={updateUser.isPending}
          >
            Avbryt
          </Button>
          <Button type="submit" form={formId} disabled={updateUser.isPending}>
            {updateUser.isPending ? "Lagrer..." : "Lagre endringer"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <div className={styles.nameFields}>
          <form.AppField
            name="firstName"
            validators={{ onChange: schema.shape.firstName }}
          >
            {(field) => <field.TextInput label="Fornavn" autoFocus />}
          </form.AppField>

          <form.AppField
            name="lastName"
            validators={{ onChange: schema.shape.lastName }}
          >
            {(field) => <field.TextInput label="Etternavn" />}
          </form.AppField>
        </div>

        <form.AppField
          name="email"
          validators={{ onChange: schema.shape.email }}
        >
          {(field) => <field.TextInput label="E-post" />}
        </form.AppField>

        <form.AppField
          name="phoneNumber"
          validators={{ onChange: schema.shape.phoneNumber }}
        >
          {(field) => <field.TextInput label="Telefonnummer" />}
        </form.AppField>

        <fieldset className={styles.statusFields}>
          <legend>Status</legend>
          <form.AppField name="isActive">
            {(field) => <field.Checkbox label="Aktiv" />}
          </form.AppField>
          <form.AppField name="isPang">
            {(field) => <field.Checkbox label="Pang" />}
          </form.AppField>
        </fieldset>
      </form>
    </Dialog>
  );
}
