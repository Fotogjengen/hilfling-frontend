const SEMESTER_PATTERN = /^([VH])(\d{2}|\d{4})$/;

export function createSemesterOptions(
  extraSemesters: readonly string[] = [],
): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();

  const defaultOptions = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ].flatMap((year) => [
    { label: `V${year}`, value: `V${year}` },
    { label: `H${year}`, value: `H${year}` },
  ]);

  const extraOptions = extraSemesters
    .map((semester) => semester.trim().toUpperCase())
    .filter(
      (semester) =>
        SEMESTER_PATTERN.test(semester) &&
        !defaultOptions.some((option) => option.value === semester),
    )
    .map((semester) => ({ label: semester, value: semester }));

  return [...defaultOptions, ...extraOptions].sort(
    (a, b) => semesterSortValue(a.value) - semesterSortValue(b.value),
  );
}

export function semesterSortValue(semester: string): number {
  const match = semester.trim().toUpperCase().match(SEMESTER_PATTERN);

  if (!match) {
    const timestamp = new Date(semester).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  const year = Number(match[2].length === 2 ? `20${match[2]}` : match[2]);

  return year * 2 + (match[1] === "H" ? 1 : 0);
}
