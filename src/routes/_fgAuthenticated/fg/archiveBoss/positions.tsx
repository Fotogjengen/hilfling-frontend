import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import styles from "./positions.module.css";
import { PositionDto } from "@/../generated";
import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import {
  usePositions,
  useDeletePosition,
  useUpdatePosition,
  usePostPosition,
} from "@/hooks/position";
import ArchiveBossEditPositionSchema from "@/components/Arkivsjef/ArchiveBossEditPositionSchema/ArchiveBossEditPositionSchema";
import ArchiveBossCreatePosition from "@/components/Arkivsjef/ArchiveBossCreatePosition/ArchiveBossCreatePosition";
import ArchiveBossEditPositionPermissions from "@/components/Arkivsjef/ArchiveBossEditPositionPermissions/ArchiveBossEditPositionPermissions";
import type { PositionCreateRequest } from "@/utils/api/PositionApi";
import { Button } from "@/components/ui/input/Button";
import { Plus, ShieldCheck } from "lucide-react";

export const Route = createFileRoute(
  "/_fgAuthenticated/fg/archiveBoss/positions",
)({
  component: Positions,
});

const sortOptions = [
  { label: "Tittel A-Å", value: "titleAsc" },
  { label: "Tittel Å-A", value: "titleDesc" },
];

function Positions() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("titleAsc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPositionDialog, setNewPositionDialog] = useState(false);
  const [permissionsPosition, setPermissionsPosition] =
    useState<PositionDto | null>(null);

  const { data: positions = [], isLoading } = usePositions();
  const deletePosition = useDeletePosition();
  const patchPosition = useUpdatePosition();
  const postPosition = usePostPosition();

  const onClose = () => {
    setEditingId(null);
  };

  const onCreate = (newPosition: PositionCreateRequest) => {
    postPosition.mutate(newPosition, {
      onSuccess: () => setNewPositionDialog(false),
    });
  };

  const onDelete = (position: PositionDto) => {
    deletePosition.mutate(position.positionId.id);
  };

  const onPatch = (position: PositionDto) => {
    patchPosition.mutate(position, { onSuccess: onClose });
  };

  const onEdit = (position: PositionDto) => {
    setEditingId(position.positionId.id);
  };

  const filteredAndSortedPositions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = positions.filter(
      (position) =>
        position.title.toLowerCase().includes(normalizedSearch) ||
        (position.email?.value.toLowerCase().includes(normalizedSearch) ??
          false),
    );
    return filtered.toSorted((a, b) => {
      switch (sort) {
        case "titleAsc":
          return a.title.localeCompare(b.title);
        case "titleDesc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [positions, sort, search]);

  return (
    <div className={styles.position_page}>
      <header className={styles.pageHeader}>
        <h1> Verv </h1>
      </header>
      <div className={styles.positionDatabase}>
        Det finnes {positions.length} verv i databasen
      </div>
      <div className={styles.buttonDiv}>
        <Button
          size="sm"
          onClick={() => setNewPositionDialog(true)}
          className={styles.newPositionButton}
        >
          <Plus size={16} aria-hidden="true" />
          Opprett nytt verv
        </Button>
        {newPositionDialog && (
          <ArchiveBossCreatePosition
            onClose={() => setNewPositionDialog(false)}
            onCreate={onCreate}
          />
        )}
      </div>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Søk etter verv"
          aria-label="Søk etter verv"
          className={styles.search}
        />
        <div className={styles.controls}>
          <label className={styles.sortControl}>
            <span> Sorter </span>
            <Select
              options={sortOptions}
              value={sort}
              onValueChange={setSort}
              className={styles.sortSelect}
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <p> Laster verv... </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th> Verv </th>
              <th> E-post </th>
              <th> Handlinger </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPositions.map((position) => (
              <ArchiveBossItem<PositionDto>
                key={position.positionId.id}
                dtoObject={position}
                columns={[position.title, position.email?.value ?? "–"]}
                editPopUp={editingId === position.positionId.id}
                onDelete={onDelete}
                onPatch={onPatch}
                onClose={onClose}
                onEdit={onEdit}
                EditSchema={ArchiveBossEditPositionSchema}
                deleteWarningMessage={`Er du sikker på at du vil slette ${position.title}? Alle fotogjengere med dette vervet mister det, samt alle tilgangene sine`}
                actions={
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => setPermissionsPosition(position)}
                    className={styles.iconTextButton}
                  >
                    <ShieldCheck size={16} aria-hidden="true" />
                    Endre tilganger
                  </Button>
                }
              />
            ))}
          </tbody>
        </table>
      )}
      {permissionsPosition && (
        <ArchiveBossEditPositionPermissions
          position={permissionsPosition}
          onClose={() => setPermissionsPosition(null)}
        />
      )}
    </div>
  );
}
