// Strict 2-digit year validation for new input
const SEMESTER_PATTERN = /^([VH])\d{2}$/;

// Backward-compatible parse pattern for legacy data (also accepts 4 digits)
const SEMESTER_PARSE_PATTERN = /^([VH])(\d{2}|\d{4})$/;

export function semesterSortValue(semester: string): number {
  const match = semester.trim().toUpperCase().match(SEMESTER_PARSE_PATTERN);

  if (!match) {
    const timestamp = new Date(semester).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  const year = Number(match[2].length === 2 ? `20${match[2]}` : match[2]);

  return year * 2 + (match[1] === "H" ? 1 : 0);
}

export function isValidSemester(value: string): boolean {
  return SEMESTER_PATTERN.test(value.trim().toUpperCase());
}

export function normalizeSemester(value: string): string {
  const match = value.trim().toUpperCase().match(SEMESTER_PARSE_PATTERN);
  if (!match) return value.trim().toUpperCase();

  // Always normalize to 2-digit for consistency
  return `${match[1]}${match[2].slice(-2)}`;
}
