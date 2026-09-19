import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import type { PhotoGangBangerDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import { Select } from "@/components/ui/input/Select";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { toast } from "@/components/ui/overlay/Toaster";
import { useReplacePhotoGangBangerPositions } from "@/hooks/photoGangBangers";
import { PositionApi } from "@/utils/api/PositionApi";
import { createSemesterOptions, semesterSortValue } from "@/utils/semester";
import styles from "./EditPositionsDialog.module.css";
import { Link } from "@tanstack/react-router";

interface EditPositionsDialogProps {
  user: PhotoGangBangerDto;
  onClose: () => void;
}

interface PositionRow {
  key: string;
  positionId: string;
  semesterStart: string;
  semesterEnd: string;
}

const ONGOING_POSITION_VALUE = "pågående";

function toPositionRows(user: PhotoGangBangerDto): PositionRow[] {
  return [...user.positions]
    .sort(
      (a, b) =>
        semesterSortValue(a.semesterStart.value) -
        semesterSortValue(b.semesterStart.value),
    )
    .map((position) => ({
      key: `${position.positionId.id}-${position.semesterStart.value}`,
      positionId: position.positionId.id,
      semesterStart: position.semesterStart.value,
      semesterEnd: position.semesterEnd?.value ?? "",
    }));
}

function getRowErrors(rows: PositionRow[]): Record<string, string> {
  const errors: Record<string, string> = {};
  const seen = new Set<string>();

  rows.forEach((row) => {
    if (!row.positionId) {
      errors[row.key] = "Velg verv";
      return;
    }
    if (!row.semesterStart) {
      errors[row.key] = "Velg startsemester";
      return;
    }
    if (
      row.semesterEnd &&
      semesterSortValue(row.semesterEnd) < semesterSortValue(row.semesterStart)
    ) {
      errors[row.key] = "Sluttsemester kan ikke være før startsemester";
      return;
    }
    const assignment = `${row.positionId}-${row.semesterStart}`;
    if (seen.has(assignment)) {
      errors[row.key] = "Verv og startsemester er allerede i listen";
      return;
    }
    seen.add(assignment);
  });

  return errors;
}

export function EditPositionsDialog({
  user,
  onClose,
}: EditPositionsDialogProps) {
  const replacePositions = useReplacePhotoGangBangerPositions();
  const formId = `edit-positions-${user.photoGangBangerId.id}`;
  const fullName = user.name || user.username;

  const [positionRows, setPositionRows] = useState<PositionRow[]>(() =>
    toPositionRows(user),
  );
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const { data: positions = [] } = useQuery({
    queryKey: ["positions"],
    queryFn: () =>
      PositionApi.getAll().then((response) => response.data.currentList),
  });

  const semesterExtras = user.positions.flatMap((position) => [
    position.semesterStart.value,
    position.semesterEnd?.value ?? "",
  ]);
  const semesterOptions = createSemesterOptions(semesterExtras);
  const endSemesterOptions = [
    { label: "d.d.", value: ONGOING_POSITION_VALUE },
    ...semesterOptions,
  ];
  const positionOptions = positions.map((position) => ({
    label: position.title,
    value: position.positionId.id,
  }));

  const isSaving = replacePositions.isPending;

  const updatePositionRow = (
    key: string,
    patch: Partial<Omit<PositionRow, "key">>,
  ) => {
    setPositionRows((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
    setRowErrors((errors) => {
      if (!errors[key]) return errors;
      const nextErrors = { ...errors };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const addPositionRow = () => {
    setPositionRows((rows) => [
      ...rows,
      {
        key: crypto.randomUUID(),
        positionId: "",
        semesterStart: user.semesterStart?.value ?? "",
        semesterEnd: "",
      },
    ]);
  };

  const removePositionRow = (key: string) => {
    setPositionRows((rows) => rows.filter((row) => row.key !== key));
    setRowErrors((errors) => {
      if (!errors[key]) return errors;
      const nextErrors = { ...errors };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const handleSave = async () => {
    const errors = getRowErrors(positionRows);
    setRowErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Rett feilene i verv-listen før du lagrer");
      return;
    }

    try {
      await replacePositions.mutateAsync({
        photoGangBangerId: user.photoGangBangerId,
        positions: positionRows.map((row) => ({
          positionId: { id: row.positionId },
          semesterStart: { value: row.semesterStart },
          semesterEnd: row.semesterEnd ? { value: row.semesterEnd } : undefined,
        })),
      });
      toast.success("Vervene ble oppdatert");
      onClose();
    } catch (error) {
      toast.error("Kunne ikke oppdatere vervene", {
        description: error instanceof Error ? error.message : "Ukjent feil",
      });
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
      title={`Rediger verv for ${fullName}`}
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
            {isSaving ? "Lagrer..." : "Lagre verv"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave();
        }}
      >
        {positionRows.length === 0 ? (
          <p className={styles.positionsEmpty}>Ingen verv registrert</p>
        ) : (
          <ul className={styles.positionsList}>
            {positionRows.map((row) => (
              <li
                key={row.key}
                className={[
                  styles.positionCard,
                  rowErrors[row.key] ? styles.positionCardError : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className={styles.positionCardHeader}>
                  <Select
                    className={styles.positionSelect}
                    options={positionOptions}
                    value={row.positionId}
                    onValueChange={(positionId) =>
                      updatePositionRow(row.key, { positionId })
                    }
                    placeholder="Velg verv"
                    ariaLabel="Verv"
                  />
                  <button
                    type="button"
                    className={styles.positionRemove}
                    onClick={() => removePositionRow(row.key)}
                    aria-label="Fjern verv"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
                <div className={styles.positionSemesters}>
                  <span className={styles.positionSemesterLabel}>Fra</span>
                  <Select
                    options={semesterOptions}
                    value={row.semesterStart}
                    onValueChange={(semesterStart) =>
                      updatePositionRow(row.key, { semesterStart })
                    }
                    placeholder="Velg semester"
                    ariaLabel="Startsemester"
                  />
                  <span className={styles.positionSemesterLabel}>Til</span>
                  <Select
                    options={endSemesterOptions}
                    value={row.semesterEnd || ONGOING_POSITION_VALUE}
                    onValueChange={(semesterEnd) =>
                      updatePositionRow(row.key, {
                        semesterEnd:
                          semesterEnd === ONGOING_POSITION_VALUE
                            ? ""
                            : semesterEnd,
                      })
                    }
                    ariaLabel="Sluttsemester"
                  />
                </div>
                {rowErrors[row.key] && (
                  <span className={styles.positionError} role="alert">
                    {rowErrors[row.key]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <Button
          type="button"
          variant="neutral"
          size="sm"
          className={styles.addPositionButton}
          onClick={addPositionRow}
        >
          <Plus size={16} aria-hidden="true" />
          Legg til verv
        </Button>
        <p className={styles.helpText}>
          Trenger du å oppdatere hvilke tilganger et verv har? Gå til{" "}
          <Link to="/fg/archiveBoss">Arkivsjef-siden</Link>
        </p>
      </form>
    </Dialog>
  );
}
