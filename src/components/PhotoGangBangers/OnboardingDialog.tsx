import { useState } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import type { PhotoGangBangerDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { toast } from "@/components/ui/overlay/Toaster";
import {
  useCompleteOnboarding,
  useCurrentPhotoGangBanger,
} from "@/hooks/photoGangBangers";
import { isValidSemester, normalizeSemester } from "@/utils/semester";
import useAppForm from "@/contexts/FormContext";
import styles from "./OnboardingDialog.module.css";

const schema = z.object({
  name: z.string().trim().min(1, "Navn er obligatorisk"),
  phoneNumber: z.string().regex(/^[49]\d{7}$/, "Ugyldig telefonnummer"),
  semesterStart: z
    .string()
    .min(1, "Startsemester er obligatorisk")
    .refine(
      (v) => isValidSemester(v),
      "Ugyldig semester (format: V25 eller H25)",
    ),
  foodPreference: z.string(),
  birthday: z.union([z.date(), z.undefined()]),
  isActive: z.boolean(),
  isPang: z.boolean(),
});

export function OnboardingDialogHost() {
  const { data: currentUser } = useCurrentPhotoGangBanger();

  if (!currentUser || currentUser.isOnboarded) return null;
  return <OnboardingDialog user={currentUser} />;
}

function OnboardingDialog({ user }: { user: PhotoGangBangerDto }) {
  const completeOnboarding = useCompleteOnboarding();
  const formId = "photo-gang-banger-onboarding";
  const isSaving = completeOnboarding.isPending;
  const [step, setStep] = useState<1 | 2>(1);

  const form = useAppForm({
    defaultValues: {
      // Auto-registered users get their username as a placeholder name
      name: user.name === user.username ? "" : user.name,
      phoneNumber: user.phoneNumber ?? "",
      semesterStart: user.semesterStart?.value ?? "",
      foodPreference: user.foodPreference ?? "",
      birthday: user.birthday ? parseISO(user.birthday) : undefined,
      isActive: user.isActive,
      isPang: user.isPang,
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      try {
        await completeOnboarding.mutateAsync({
          name: value.name.trim(),
          phoneNumber: value.phoneNumber,
          semesterStart: { value: normalizeSemester(value.semesterStart) },
          foodPreference: value.foodPreference.trim() || undefined,
          birthday: value.birthday
            ? format(value.birthday, "yyyy-MM-dd")
            : undefined,
          isActive: value.isActive,
          isPang: value.isPang,
        });
        toast.success("Velkommen til Fotogjengen!");
      } catch (error) {
        toast.error("Kunne ikke lagre profilen", {
          description: error instanceof Error ? error.message : "Ukjent feil",
        });
      }
    },
  });

  const goToNextStep = async () => {
    const errors = await Promise.all([
      form.validateField("name", "change"),
      form.validateField("phoneNumber", "change"),
    ]);
    if (errors.every((fieldErrors) => fieldErrors.length === 0)) setStep(2);
  };

  return (
    <Dialog
      open
      dismissible={false}
      title={`Velkommen til Fotogjengen! (${step}/2)`}
      actions={
        step === 1 ? (
          <Button key="next" type="submit" form={formId}>
            Neste
          </Button>
        ) : (
          <>
            <Button
              key="back"
              type="button"
              variant="neutral"
              onClick={() => setStep(1)}
              disabled={isSaving}
            >
              Tilbake
            </Button>
            <Button
              key="submit"
              type="submit"
              form={formId}
              disabled={isSaving}
            >
              {isSaving ? "Lagrer..." : "Fullfør"}
            </Button>
          </>
        )
      }
    >
      <form
        id={formId}
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void (step === 1 ? goToNextStep() : form.handleSubmit());
        }}
      >
        {step === 1 ? (
          <div key="step-1" className={styles.step}>
            <p className={styles.intro}>
              Vi trenger litt informasjon om deg før du kan komme i gang.
            </p>

            <form.AppField
              name="name"
              validators={{ onChange: schema.shape.name }}
            >
              {(field) => <field.TextInput label="Navn" autoFocus />}
            </form.AppField>

            <form.AppField
              name="phoneNumber"
              validators={{ onChange: schema.shape.phoneNumber }}
            >
              {(field) => <field.TextInput label="Telefonnummer" />}
            </form.AppField>

            <form.AppField name="birthday">
              {(field) => <field.DatePicker label="Bursdag (valgfritt)" />}
            </form.AppField>
          </div>
        ) : (
          <div key="step-2" className={styles.step}>
            <p className={styles.intro}>Litt om tiden din i Fotogjengen.</p>

            <form.AppField
              name="semesterStart"
              validators={{ onChange: schema.shape.semesterStart }}
            >
              {(field) => (
                <field.SemesterPicker
                  label="Startsemester"
                  placeholder="f.eks. V25"
                />
              )}
            </form.AppField>

            <form.AppField name="foodPreference">
              {(field) => <field.TextInput label="Matpreferanse (valgfritt)" />}
            </form.AppField>

            <div className={styles.statusFields}>
              <form.AppField name="isActive">
                {(field) => <field.Checkbox label="Aktiv" />}
              </form.AppField>
              <form.AppField name="isPang">
                {(field) => <field.Checkbox label="Pang" />}
              </form.AppField>
            </div>
          </div>
        )}
      </form>
    </Dialog>
  );
}
