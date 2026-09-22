import { useState } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import type { PhotoGangBangerDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/display/Accordion";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { toast } from "@/components/ui/overlay/Toaster";
import { useUpdatePhotoGangBanger } from "@/hooks/photoGangBangers";
import { createSemesterOptions } from "@/utils/semester";
import useAppForm from "@/contexts/FormContext";
import styles from "./EditPhotoGangBangerDialog.module.css";

interface EditPhotoGangBangerDialogProps {
  user: PhotoGangBangerDto;
  onClose: () => void;
}

const schema = z.object({
  username: z.string().trim().min(1, "Brukernavn er obligatorisk"),
  name: z.string().trim().min(1, "Navn er obligatorisk"),
  phoneNumber: z.string().regex(/^[49]\d{7}$/, "Ugyldig telefonnummer"),
  email: z.string().email("Ugyldig e-postadresse"),
  semesterStart: z.string().min(1, "Velg startsemester"),
  foodPreference: z.string(),
  birthday: z.union([z.date(), z.undefined()]),
  isActive: z.boolean(),
  isPang: z.boolean(),
});

export function EditPhotoGangBangerDialog({
  user,
  onClose,
}: EditPhotoGangBangerDialogProps) {
  const updateUser = useUpdatePhotoGangBanger();
  const formId = `edit-photo-gang-banger-${user.photoGangBangerId.id}`;
  const fullName = user.name || user.username;

  const [annetValue, setAannetValue] = useState("");

  const semesterOptions = createSemesterOptions(
    user.semesterStart ? [user.semesterStart.value] : [],
  );

  const isSaving = updateUser.isPending;

  const form = useAppForm({
    defaultValues: {
      username: user.username ?? "",
      name: user.name ?? "",
      phoneNumber: user.phoneNumber ?? "",
      email: user.email ?? "",
      semesterStart: user.semesterStart?.value ?? "",
      foodPreference: user.foodPreference ?? "",
      birthday: user.birthday ? parseISO(user.birthday) : undefined,
      isActive: user.isActive ?? false,
      isPang: user.isPang ?? false,
    },
    validators: { onChange: schema },
    onSubmitInvalid: ({ value }) => {
      if (!value.semesterStart) {
        setAannetValue("annet");
      }
    },
    onSubmit: async ({ value }) => {
      try {
        await updateUser.mutateAsync({
          photoGangBangerId: user.photoGangBangerId,
          semesterStart: { value: value.semesterStart },
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
        });
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
        if (!open && !isSaving) onClose();
      }}
      title={`Rediger ${fullName}`}
      actions={
        <>
          <Button
            type="button"
            variant="neutral"
            onClick={onClose}
            disabled={isSaving}
          >
            Avbryt
          </Button>
          <Button type="submit" form={formId} disabled={isSaving}>
            {isSaving ? "Lagrer..." : "Lagre endringer"}
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

        <Accordion
          type="single"
          collapsible
          value={annetValue}
          onValueChange={setAannetValue}
          className={styles.section}
        >
          <AccordionItem value="annet">
            <AccordionTrigger className={styles.sectionTrigger}>
              Annet
            </AccordionTrigger>
            {annetValue !== "annet" && (
              <form.Subscribe selector={(s) => s.values}>
                {(values) => (
                  <div className={styles.sectionSummary}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Startsemester:</span>
                      <span>{values.semesterStart || "-"}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Matpreferanse:</span>
                      <span>{values.foodPreference.trim() || "-"}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Bursdag:</span>
                      <span>
                        {values.birthday
                          ? format(values.birthday, "dd.MM.yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Status:</span>
                      <span>
                        {[
                          values.isActive ? "Aktiv" : "Inaktiv",
                          values.isPang ? "Pang" : null,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </form.Subscribe>
            )}
            <AccordionContent className={styles.sectionContent}>
              <div className={styles.sectionBody}>
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
                </div>

                <div className={styles.statusFields}>
                  <form.AppField name="isActive">
                    {(field) => <field.Checkbox label="Aktiv" />}
                  </form.AppField>
                  <form.AppField name="isPang">
                    {(field) => <field.Checkbox label="Pang" />}
                  </form.AppField>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Dialog>
  );
}
