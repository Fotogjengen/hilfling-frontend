import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { format } from "date-fns";
import type { MemberPositionDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { toast } from "@/components/ui/overlay/Toaster";
import { useCreatePhotoGangBanger } from "@/hooks/photoGangBangers";
import { PositionApi } from "@/utils/api/PositionApi";
import type { PhotoGangBangerCreateRequest } from "@/utils/api/PhotoGangBangerApi";
import { createSemesterOptions } from "@/utils/semester";
import useAppForm from "@/contexts/FormContext";
import styles from "./CreatePhotoGangBangerDialog.module.css";

interface CreatePhotoGangBangerDialogProps {
  onClose: () => void;
}

const schema = z.object({
  username: z.string().trim().min(1, "Brukernavn er obligatorisk"),
  name: z.string().trim().min(1, "Navn er obligatorisk"),
  phoneNumber: z.string().regex(/^[49]\d{7}$/, "Ugyldig telefonnummer"),
  email: z.string().email("Ugyldig e-postadresse"),
  semesterStart: z.string().min(1, "Velg startsemester"),
  positionId: z.string(),
  foodPreference: z.string(),
  birthday: z.union([z.date(), z.undefined()]),
  isActive: z.boolean(),
  isPang: z.boolean(),
});

const semesterOptions = createSemesterOptions();
const formId = "create-photo-gang-banger-form";

export function CreatePhotoGangBangerDialog({
  onClose,
}: CreatePhotoGangBangerDialogProps) {
  const createUser = useCreatePhotoGangBanger();
  const {
    data: positions = [],
    isLoading: isLoadingPositions,
    isError: isPositionsError,
  } = useQuery({
    queryKey: ["positions"],
    queryFn: () =>
      PositionApi.getAll().then((response) => response.data.currentList),
  });

  const form = useAppForm({
    defaultValues: {
      username: "",
      name: "",
      phoneNumber: "",
      email: "",
      semesterStart: "",
      positionId: "",
      foodPreference: "",
      birthday: undefined as Date | undefined,
      isActive: true,
      isPang: false,
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      const selectedPosition = positions.find(
        (position) => position.positionId.id === value.positionId,
      );
      const semesterStart = { value: value.semesterStart };
      const memberPositions: MemberPositionDto[] = selectedPosition
        ? [
            {
              positionId: selectedPosition.positionId,
              title: selectedPosition.title,
              email: selectedPosition.email,
              semesterStart,
              isActive: value.isActive,
            },
          ]
        : [];
      const photoGangBanger: PhotoGangBangerCreateRequest = {
        semesterStart,
        isActive: value.isActive,
        isPang: value.isPang,
        name: value.name.trim(),
        username: value.username.trim(),
        email: value.email.trim(),
        phoneNumber: value.phoneNumber,
        foodPreference: value.foodPreference.trim(),
        birthday: value.birthday
          ? format(value.birthday, "yyyy-MM-dd")
          : undefined,
        positions: memberPositions,
      };

      try {
        await createUser.mutateAsync(photoGangBanger);
        toast.success("Fotogjengeren ble lagt til");
        onClose();
      } catch (error) {
        toast.error("Kunne ikke legge til fotogjengeren", {
          description: error instanceof Error ? error.message : "Ukjent feil",
        });
      }
    },
  });

  const positionPlaceholder = isLoadingPositions
    ? "Laster verv..."
    : isPositionsError
      ? "Kunne ikke hente verv"
      : "Velg verv";

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !createUser.isPending) onClose();
      }}
      title="Legg til fotogjenger"
      actions={
        <>
          <Button
            type="button"
            variant="neutral"
            onClick={onClose}
            disabled={createUser.isPending}
          >
            Avbryt
          </Button>
          <Button type="submit" form={formId} disabled={createUser.isPending}>
            {createUser.isPending ? "Legger til..." : "Legg til"}
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
        <form.AppField
          name="username"
          validators={{ onChange: schema.shape.username }}
        >
          {(field) => <field.TextInput label="Brukernavn" autoFocus />}
        </form.AppField>

        <form.AppField name="name" validators={{ onChange: schema.shape.name }}>
          {(field) => <field.TextInput label="Navn" />}
        </form.AppField>

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

        <div className={styles.selectFields}>
          <form.AppField name="foodPreference">
            {(field) => <field.TextInput label="Matpreferanse" />}
          </form.AppField>
          <form.AppField name="birthday">
            {(field) => <field.DatePicker label="Bursdag" />}
          </form.AppField>
        </div>

        <div className={styles.selectFields}>
          <form.AppField
            name="semesterStart"
            validators={{ onChange: schema.shape.semesterStart }}
          >
            {(field) => (
              <field.Select
                label="Startsemester"
                placeholder="Velg semester"
                options={semesterOptions}
              />
            )}
          </form.AppField>

          <form.AppField name="positionId">
            {(field) => (
              <field.Select
                label="Verv"
                placeholder={positionPlaceholder}
                disabled={
                  isLoadingPositions ||
                  isPositionsError ||
                  positions.length === 0
                }
                options={positions.map((position) => ({
                  label: position.title,
                  value: position.positionId.id,
                }))}
              />
            )}
          </form.AppField>
        </div>

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
