import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { PhotoGangBangerDto } from "@/../generated";
import { CreatePhotoGangBangerDialog } from "@/components/PhotoGangBangers/CreatePhotoGangBangerDialog";
import { EditPhotoGangBangerDialog } from "@/components/PhotoGangBangers/EditPhotoGangBangerDialog";
import { EditPositionsDialog } from "@/components/PhotoGangBangers/EditPositionsDialog";
import { DataTable } from "@/components/ui/display/DataTable";
import { ProfileImage } from "@/components/ui/display/ProfileImage";
import { Button } from "@/components/ui/input/Button";
import { SearchField } from "@/components/ui/input/SearchField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { usePhotoGangBangers } from "@/hooks/photoGangBangers";
import { semesterSortValue } from "@/utils/semester";
import styles from "./gangBangers.module.css";
import { useAuth } from "@/contexts/AuthProvider";

export const Route = createFileRoute("/_fgAuthenticated/fg/gang_bangers/")({
  component: GangBangers,
});

const emptyUsers: PhotoGangBangerDto[] = [];

function GangBangers() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PhotoGangBangerDto | null>(
    null,
  );
  const [positionsUser, setPositionsUser] = useState<PhotoGangBangerDto | null>(
    null,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, isLoading, isError } = usePhotoGangBangers();
  const users = data?.currentList ?? emptyUsers;
  const { user } = useAuth();

  const canEditUsers = useMemo(() => {
    return user?.permissions.includes("USER_MANAGE");
  }, [user]);

  const columns = useMemo<ColumnDef<PhotoGangBangerDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Navn",
        sortingFn: (a, b) =>
          a.original.name.localeCompare(b.original.name, "nb"),
        cell: ({ row }) => (
          <div className={styles.userCell}>
            <ProfileImage
              src={row.original.profilePicture?.link}
              alt={row.original.name}
              size={32}
            />
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Epost",
        cell: ({ row }) => <EmailAddresses user={row.original} />,
      },
      {
        accessorKey: "phoneNumber",
        header: "Telefon",
        cell: ({ row }) => row.original.phoneNumber || "-",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            active={row.original.isActive}
            pang={row.original.isPang}
          />
        ),
      },
      {
        id: "positions",
        accessorFn: getPositions,
        header: "Verv",
        cell: ({ row }) => <Positions user={row.original} />,
      },
      {
        accessorKey: "semesterStart",
        header: "Startsemester",
        cell: ({ row }) => row.original.semesterStart.value || "-",
      },
      {
        accessorKey: "birthday",
        header: "Bursdag",
        cell: ({ row }) =>
          row.original.birthday
            ? format(parseISO(row.original.birthday), "dd.MM.yyyy")
            : "-",
      },
      {
        accessorKey: "foodPreference",
        header: "Matpreferanse",
        cell: ({ row }) => row.original.foodPreference || "-",
      },
      ...(canEditUsers
        ? [
            {
              id: "actions",
              cell: ({ row }) => (
                <div className={styles.actions}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="neutral"
                        size="sm"
                        className={styles.menuButton}
                        aria-label={`Handlinger for ${row.original.name}`}
                      >
                        <MoreHorizontal size={16} aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => setEditingUser(row.original)}
                      >
                        <Pencil size={16} aria-hidden="true" />
                        Rediger
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setPositionsUser(row.original)}
                      >
                        <Tags size={16} aria-hidden="true" />
                        Oppdater verv
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Trash2 size={16} aria-hidden="true" />
                        Slett
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ),
            } satisfies ColumnDef<PhotoGangBangerDto>,
          ]
        : []),
      {
        id: "semester",
        accessorFn: getSemesterSortValue,
        sortingFn: "basic",
      },
    ],
    [canEditUsers],
  );

  const table = useReactTable({
    data: users,
    columns,
    getRowId: (user) => user.photoGangBangerId.id,
    state: {
      rowSelection,
      globalFilter: search,
    },
    initialState: {
      columnVisibility: { semester: false },
      sorting: [{ id: "semester", desc: true }],
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearch,
    // Search the combined user fields once per row, including position emails.
    getColumnCanGlobalFilter: (column) => column.id === "name",
    globalFilterFn: (row, _columnId, value: string) =>
      getSearchText(row.original).includes(value.trim().toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={styles.gangBangers}>
      <header className={styles.pageHeader}>
        <h1>Brukere</h1>
        <p>
          {isLoading
            ? "Laster fotogjengere..."
            : `Det finnes ${data?.totalRecords ?? users.length} fotogjengere i databasen`}
        </p>
        {canEditUsers && (
          <Button
            size="sm"
            className={styles.addButton}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus size={16} aria-hidden="true" />
            Legg til fotogjenger
          </Button>
        )}
      </header>

      <div className={styles.toolbar}>
        <SearchField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="søk etter navn, epost eller telefon"
          aria-label="søk etter fotogjenger"
          className={styles.search}
        />
      </div>

      <section className={styles.tableSection} aria-label="Fotogjengere">
        <DataTable
          table={table}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="Ingen fotogjengere matcher søket."
          errorMessage="Kunne ikke hente fotogjengere akkurat naa."
          columnClassNames={{
            select: { header: styles.checkCell, cell: styles.checkCell },
          }}
        />
      </section>

      {editingUser && (
        <EditPhotoGangBangerDialog
          key={editingUser.photoGangBangerId.id}
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {positionsUser && (
        <EditPositionsDialog
          key={positionsUser.photoGangBangerId.id}
          user={positionsUser}
          onClose={() => setPositionsUser(null)}
        />
      )}

      {isCreateDialogOpen && (
        <CreatePhotoGangBangerDialog
          onClose={() => setIsCreateDialogOpen(false)}
        />
      )}
    </div>
  );
}

function StatusBadge({ active, pang }: { active: boolean; pang: boolean }) {
  return (
    <span
      className={[styles.statusBadge, active ? styles.active : styles.inactive]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true" />
      {active ? (pang ? "Aktiv Pang" : "Aktiv") : "Pang"}
    </span>
  );
}

function EmailAddresses({ user }: { user: PhotoGangBangerDto }) {
  return (
    <div className={styles.emailCell}>
      <span className={styles.personalEmail}>{user.email || "-"}</span>
    </div>
  );
}

function Positions({ user }: { user: PhotoGangBangerDto }) {
  const positions = [...user.positions].sort((a, b) => {
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
    }
    return (
      semesterSortValue(b.semesterStart.value) -
      semesterSortValue(a.semesterStart.value)
    );
  });

  if (positions.length === 0) {
    return "-";
  }

  return (
    <ul className={styles.positionsCell}>
      {positions.map((position) => (
        <li
          key={`${position.positionId.id}-${position.semesterStart.value}`}
          className={[
            styles.positionItem,
            position.isActive ? null : styles.positionItemOld,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{position.title}</span>
          <span className={styles.positionSemesters}>
            {position.semesterStart.value}
            {position.semesterEnd ? `–${position.semesterEnd.value}` : "–d.d."}
          </span>
        </li>
      ))}
    </ul>
  );
}

function getPositions(user: PhotoGangBangerDto) {
  const activePositions = user.positions
    .filter((position) => position.isActive)
    .map((position) => position.title);
  const positions = activePositions.length
    ? activePositions
    : user.positions.map((position) => position.title);

  return positions.join(", ") || "-";
}

function getSearchText(user: PhotoGangBangerDto) {
  return [
    user.name,
    user.username,
    user.email,
    user.phoneNumber,
    ...user.positions.flatMap((position) => [
      position.title,
      position.semesterStart.value,
      position.semesterEnd?.value ?? "",
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

function getSemesterSortValue(user: PhotoGangBangerDto) {
  const semester = user.semesterStart.value.trim().toUpperCase();
  const match = semester.match(/^([VH])(\d{2}|\d{4})$/);

  if (!match) {
    const timestamp = new Date(semester).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  const year = Number(match[2].length === 2 ? `20${match[2]}` : match[2]);
  const halfYear = match[1] === "H" ? 1 : 0;

  return year * 2 + halfYear;
}
