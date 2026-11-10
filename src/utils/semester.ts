const SEMESTER_PATTERN = /^([VH])(\d{2})$/;

export function semesterSortValue(semester: string): number {
  const match = semester.trim().toUpperCase().match(SEMESTER_PATTERN);

  if (!match) {
    const timestamp = new Date(semester).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  // Two-digit years up to next year are 20xx, older ones 19xx. We need to fix this when
  // fotogjengen is 100 years old, so in about 30 years :)
  const nextTwoDigit = (new Date().getFullYear() + 1) % 100;
  const twoDigit = Number(match[2]);
  const year = twoDigit <= nextTwoDigit ? 2000 + twoDigit : 1900 + twoDigit;

  return year * 2 + (match[1] === "H" ? 1 : 0);
}

export function isValidSemester(value: string): boolean {
  return SEMESTER_PATTERN.test(normalizeSemester(value));
}

export function normalizeSemester(value: string): string {
  return value.trim().toUpperCase();
}
