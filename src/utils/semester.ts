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

  let year: number;
  if (match[2].length === 4) {
    year = Number(match[2]);
  } else {
    // the current year is the newest value, going back in time. We need to fix this when
    // fotogjengen is 100 years old, so in about 30 years :)
    const currentTwoDigit = new Date().getFullYear() % 100;
    const twoDigit = Number(match[2]);
    year = twoDigit <= currentTwoDigit ? 2000 + twoDigit : 1900 + twoDigit;
  }

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
