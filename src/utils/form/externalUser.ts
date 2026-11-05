import { z } from "zod";
import { SecurityLevelDto } from "@/../generated";

export const securityLevelOptions = [
  { label: "Alle", value: SecurityLevelDto.securityLevelType.ALLE },
  { label: "Husfolk", value: SecurityLevelDto.securityLevelType.HUSFOLK },
  { label: "FG", value: SecurityLevelDto.securityLevelType.FG },
];

export const securityLevelLabel = (level?: SecurityLevelDto | null) =>
  securityLevelOptions.find((o) => o.value === level?.securityLevelType)
    ?.label ?? "Alle";

export const externalUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Brukernavn er obligatorisk")
    .max(20, "Brukernavn kan maks være 20 tegn"),
  fullName: z.string().trim().max(50, "Navn kan maks være 50 tegn"),
  email: z.union([
    z.literal(""),
    z.email("Ugyldig e-postadresse").max(50, "E-post kan maks være 50 tegn"),
  ]),
  securityLevel: z.enum(SecurityLevelDto.securityLevelType),
  description: z.string().trim(),
});

export const passwordSchema = z
  .string()
  .min(8, "Passordet må være minst 8 tegn");

export const confirmPasswordValidator = ({
  value,
  fieldApi,
}: {
  value: string;
  fieldApi: { form: { getFieldValue: (name: "password") => unknown } };
}) =>
  value !== fieldApi.form.getFieldValue("password")
    ? "Passordene er ikke like"
    : undefined;
