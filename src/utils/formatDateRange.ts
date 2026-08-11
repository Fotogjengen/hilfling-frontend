import { format } from "date-fns";
import { DateRange } from "../types";

/** A human-readable label for an applied date range, e.g. "01.01.2024 – 31.12.2024". */
export function formatDateRange(
  range: DateRange | undefined,
): string | undefined {
  if (!range) return undefined;
  const fmt = (d: Date) => format(d, "dd.MM.yyyy");
  if (range.from && range.to) return `${fmt(range.from)} – ${fmt(range.to)}`;
  if (range.from) return `Etter ${fmt(range.from)}`;
  if (range.to) return `Før ${fmt(range.to)}`;
  return undefined;
}
