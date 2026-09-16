export function getFieldErrorMessage(error: unknown): string | undefined {
  if (error == null) return undefined;
  if (typeof error === "string") return error;

  if (
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Ugyldig verdi";
}
