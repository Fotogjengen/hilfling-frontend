import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { Filter, Pencil, Plus, Trash2 } from "lucide-react";
import type { PhotoGangBangerDto } from "@/../generated";
import { ProfileImage } from "@/components/ui/display/ProfileImage";
import { Button } from "@/components/ui/input/Button";
import { Checkbox } from "@/components/ui/input/Checkbox";
import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import { usePhotoGangBangers } from "@/hooks/photoGangBangers";
import { CreatePhotoGangBangerDialog } from "./-CreatePhotoGangBangerDialog";
import { EditPhotoGangBangerDialog } from "./-EditPhotoGangBangerDialog";
import styles from "./gangBangers.module.css";

export const Route = createFileRoute("/_fgAuthenticated/fg/gang_bangers/")({
  component: GangBangers,
});

const sortOptions = [
  { label: "Nyeste først", value: "newest" },
  { label: "Eldste først", value: "oldest" },
  { label: "Navn A-AA", value: "nameAsc" },
];

const emptyUsers: PhotoGangBangerDto[] = [];

function GangBangers() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PhotoGangBangerDto | null>(
    null,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, isLoading, isError } = usePhotoGangBangers();
  const users = data?.currentList ?? emptyUsers;

  const columns = useMemo<ColumnDef<PhotoGangBangerDto>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked === true)
            }
            disabled={table.getRowModel().rows.length === 0}
            className={styles.checkbox}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(checked === true)}
            className={styles.checkbox}
          />
        ),
      },
      {
        id: "name",
        accessorFn: getFullName,
        header: "Navn",
        sortingFn: (a, b) =>
          getFullName(a.original).localeCompare(getFullName(b.original), "nb"),
        cell: ({ row }) => (
          <div className={styles.userCell}>
            <ProfileImage
              src={row.original.profilePicture}
              alt={getFullName(row.original)}
              size={32}
            />
            <span>{getFullName(row.original)}</span>
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
      },
      {
        id: "actions",
        header: "Handlinger",
        cell: ({ row }) => (
          <div className={styles.actions}>
            <Button
              size="sm"
              className={styles.iconTextButton}
              onClick={() => setEditingUser(row.original)}
            >
              <Pencil size={16} aria-hidden="true" />
              Rediger
            </Button>
            <Button
              variant="danger"
              size="sm"
              className={styles.iconTextButton}
              disabled
            >
              <Trash2 size={16} aria-hidden="true" />
              Slett
            </Button>
          </div>
        ),
      },
      {
        id: "semester",
        accessorFn: getSemesterSortValue,
        sortingFn: "basic",
      },
    ],
    [],
  );

  // Keep sorting stable across dialog and selection updates to avoid reset loops.
  const sorting = useMemo<SortingState>(
    () => [
      {
        id: sort === "nameAsc" ? "name" : "semester",
        desc: sort === "newest",
      },
    ],
    [sort],
  );

  const table = useReactTable({
    data: users,
    columns,
    getRowId: (user) => user.photoGangBangerId.id,
    state: {
      rowSelection,
      globalFilter: search,
      sorting,
    },
    initialState: { columnVisibility: { semester: false } },
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
        <div className={styles.controls}>
          <Button variant="neutral" size="sm" className={styles.iconTextButton}>
            <Filter size={16} aria-hidden="true" />
            Filter
          </Button>
          <label className={styles.sortControl}>
            <span>Sorter</span>
            <Select
              options={sortOptions}
              value={sort}
              onValueChange={setSort}
              className={styles.sortSelect}
            />
          </label>
        </div>
      </div>

      <Button
        size="sm"
        className={styles.addButton}
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus size={16} aria-hidden="true" />
        Legg til fotogjenger
      </Button>

      <section className={styles.tableSection} aria-label="Fotogjengere">
        <div className={styles.tableActions}>
          <Button
            variant="danger"
            size="sm"
            className={styles.iconTextButton}
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <Trash2 size={16} aria-hidden="true" />
            Slett alle markerte
          </Button>
        </div>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        header.column.id === "select"
                          ? styles.checkCell
                          : header.column.id === "actions"
                            ? styles.actionsHeader
                            : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={
                        cell.column.id === "select"
                          ? styles.checkCell
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
          <p className={styles.emptyState}>Ingen fotogjengere matcher søket.</p>
        )}
        {isError && (
          <p className={styles.emptyState}>
            Kunne ikke hente fotogjengere akkurat naa.
          </p>
        )}
      </section>

      {editingUser && (
        <EditPhotoGangBangerDialog
          key={editingUser.photoGangBangerId.id}
          user={editingUser}
          onClose={() => setEditingUser(null)}
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

function getFullName(user: PhotoGangBangerDto) {
  return `${user.firstName} ${user.lastName}`.trim() || user.username;
}

function EmailAddresses({ user }: { user: PhotoGangBangerDto }) {
  const positionEmails = getPositionEmails(user);

  return (
    <div className={styles.emailCell}>
      {positionEmails.map((email) => (
        <span key={email} className={styles.positionEmail}>
          {email}
        </span>
      ))}
      <span
        className={positionEmails.length ? styles.personalEmail : undefined}
      >
        {user.email || "-"}
      </span>
    </div>
  );
}

function getPositionEmails(user: PhotoGangBangerDto) {
  const seenEmails = new Set([user.email.trim().toLowerCase()]);

  return user.positions.flatMap((position) => {
    const email = position.email?.value?.trim() ?? "";
    const normalizedEmail = email.toLowerCase();

    if (!email || seenEmails.has(normalizedEmail)) return [];

    seenEmails.add(normalizedEmail);
    return [email];
  });
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
    getFullName(user),
    user.username,
    user.email,
    getPositionEmails(user).join(" "),
    user.phoneNumber,
    getPositions(user),
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
