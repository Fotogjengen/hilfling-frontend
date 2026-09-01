import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { MemberPositionDto, PhotoGangBangerDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { toast } from "@/components/ui/overlay/Toaster";
import { useCreatePhotoGangBanger } from "@/hooks/photoGangBangers";
import { PositionApi } from "@/utils/api/PositionApi";
import useAppForm from "@/utils/form/FormContext";
import styles from "./CreatePhotoGangBangerDialog.module.css";

interface CreatePhotoGangBangerDialogProps {
  onClose: () => void;
}

const schema = z.object({
  username: z.string().trim().min(1, "Brukernavn er obligatorisk"),
  firstName: z.string().trim().min(1, "Fornavn er obligatorisk"),
  lastName: z.string().trim().min(1, "Etternavn er obligatorisk"),
  phoneNumber: z.string().regex(/^[1-9]\d{7}$/, "Ugyldig telefonnummer"),
  email: z.string().email("Ugyldig e-postadresse"),
  semesterStart: z.string().min(1, "Velg startsemester"),
  positionId: z.string(),
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
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      semesterStart: "",
      positionId: "",
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
      const photoGangBanger: PhotoGangBangerDto = {
        photoGangBangerId: { id: crypto.randomUUID() },
        semesterStart,
        isActive: value.isActive,
        isPang: value.isPang,
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        username: value.username.trim(),
        email: value.email.trim(),
        profilePicture: "",
        phoneNumber: value.phoneNumber,
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

        <div className={styles.nameFields}>
          <form.AppField
            name="firstName"
            validators={{ onChange: schema.shape.firstName }}
          >
            {(field) => <field.TextInput label="Fornavn" />}
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

function createSemesterOptions() {
  const currentYear = new Date().getFullYear();

  return [currentYear - 1, currentYear, currentYear + 1].flatMap((year) => [
    { label: `V${year}`, value: `V${year}` },
    { label: `H${year}`, value: `H${year}` },
  ]);
}
