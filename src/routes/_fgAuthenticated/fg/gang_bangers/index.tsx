import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

function GangBangers() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PhotoGangBangerDto | null>(
    null,
  );
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    () => new Set(),
  );
  const { data, isLoading, isError } = usePhotoGangBangers();

  const users = data?.currentList ?? [];

  const visibleUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filteredUsers = normalizedSearch
      ? users.filter((user) => getSearchText(user).includes(normalizedSearch))
      : users;

    return [...filteredUsers].sort((a, b) => {
      if (sort === "nameAsc") {
        return getFullName(a).localeCompare(getFullName(b), "nb");
      }

      const aSemester = getSemesterSortValue(a);
      const bSemester = getSemesterSortValue(b);

      return sort === "oldest" ? aSemester - bSemester : bSemester - aSemester;
    });
  }, [search, sort, users]);

  const selectedVisibleCount = visibleUsers.filter((user) =>
    selectedUserIds.has(user.photoGangBangerId.id),
  ).length;
  const allVisibleSelected =
    visibleUsers.length > 0 && selectedVisibleCount === visibleUsers.length;
  const selectAllState =
    selectedVisibleCount === 0
      ? false
      : allVisibleSelected
        ? true
        : "indeterminate";

  const toggleUser = (userId: string, checked: boolean | "indeterminate") => {
    setSelectedUserIds((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(userId);
      } else {
        next.delete(userId);
      }

      return next;
    });
  };

  const toggleVisibleUsers = (checked: boolean | "indeterminate") => {
    setSelectedUserIds((current) => {
      const next = new Set(current);

      visibleUsers.forEach((user) => {
        if (checked) {
          next.add(user.photoGangBangerId.id);
        } else {
          next.delete(user.photoGangBangerId.id);
        }
      });

      return next;
    });
  };

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
          placeholder="Sok etter navn, epost eller telefon"
          aria-label="Sok etter fotogjenger"
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
            disabled={selectedUserIds.size === 0}
          >
            <Trash2 size={16} aria-hidden="true" />
            Slett alle markerte
          </Button>
        </div>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkCell}>
                  <Checkbox
                    checked={selectAllState}
                    onCheckedChange={toggleVisibleUsers}
                    disabled={visibleUsers.length === 0}
                    className={styles.checkbox}
                  />
                </th>
                <th>Navn</th>
                <th>Epost</th>
                <th>Telefon</th>
                <th>Status</th>
                <th>Verv</th>
                <th className={styles.actionsHeader}>Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => {
                const userId = user.photoGangBangerId.id;
                const fullName = getFullName(user);

                return (
                  <tr key={userId}>
                    <td className={styles.checkCell}>
                      <Checkbox
                        checked={selectedUserIds.has(userId)}
                        onCheckedChange={(checked) =>
                          toggleUser(userId, checked)
                        }
                        className={styles.checkbox}
                      />
                    </td>
                    <td>
                      <div className={styles.userCell}>
                        <ProfileImage
                          src={user.profilePicture}
                          alt={fullName}
                          size={32}
                        />
                        <span>{fullName}</span>
                      </div>
                    </td>
                    <td>
                      <EmailAddresses user={user} />
                    </td>
                    <td>{user.phoneNumber || "-"}</td>
                    <td>
                      <StatusBadge active={user.isActive} />
                    </td>
                    <td>{getPositions(user)}</td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          size="sm"
                          className={styles.iconTextButton}
                          onClick={() => setEditingUser(user)}
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isLoading && !isError && visibleUsers.length === 0 && (
          <p className={styles.emptyState}>Ingen fotogjengere matcher soket.</p>
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

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={[styles.statusBadge, active ? styles.active : styles.inactive]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true" />
      {active ? "Aktiv" : "Inaktiv"}
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
