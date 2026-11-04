import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KeyRound, Plus } from "lucide-react";
import styles from "./externalUsers.module.css";
import { ExternalUserDto } from "@/../generated";
import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import ArchiveBossCreateExternalUser from "@/components/Arkivsjef/ArchiveBossCreateExternalUser/ArchiveBossCreateExternalUser";
import ArchiveBossEditExternalUserSchema from "@/components/Arkivsjef/ArchiveBossEditExternalUserSchema/ArchiveBossEditExternalUserSchema";
import ArchiveBossResetExternalUserPassword from "@/components/Arkivsjef/ArchiveBossResetExternalUserPassword/ArchiveBossResetExternalUserPassword";
import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import { Button } from "@/components/ui/input/Button";
import {
  useDeleteExternalUser,
  useExternalUsers,
  useUpdateExternalUser,
} from "@/hooks/externalUser";
import { securityLevelLabel } from "@/utils/form/externalUser";

export const Route = createFileRoute(
  "/_fgAuthenticated/fg/archiveBoss/externalUsers",
)({
  component: ExternalUsers,
});

const sortOptions = [
  { label: "Brukernavn A-Å", value: "usernameAsc" },
  { label: "Brukernavn Å-A", value: "usernameDesc" },
];

function ExternalUsers() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("usernameAsc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] =
    useState<ExternalUserDto | null>(null);

  const { data: users = [], isLoading } = useExternalUsers();
  const deleteUser = useDeleteExternalUser();
  const patchUser = useUpdateExternalUser();

  const onClose = () => setEditingId(null);

  const onDelete = (user: ExternalUserDto) => {
    deleteUser.mutate(user.externalUserId.id);
  };

  const onPatch = (user: ExternalUserDto) => {
    patchUser.mutate(
      {
        externalUserId: user.externalUserId,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        securityLevel: user.securityLevel,
        description: user.description,
        isActive: user.isActive,
      },
      { onSuccess: onClose },
    );
  };

  const filteredAndSortedUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = users.filter((user) =>
      [user.username, user.fullName, user.email].some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      ),
    );
    return filtered.toSorted((a, b) =>
      sort === "usernameDesc"
        ? b.username.localeCompare(a.username)
        : a.username.localeCompare(b.username),
    );
  }, [users, sort, search]);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1> Eksterne brukere </h1>
      </header>
      <div className={styles.count}>
        Det finnes {users.length} eksterne brukere i databasen
      </div>
      <div className={styles.buttonDiv}>
        <Button
          size="sm"
          onClick={() => setCreateDialog(true)}
          className={styles.iconTextButton}
        >
          <Plus size={16} aria-hidden="true" />
          Opprett ekstern bruker
        </Button>
        {createDialog && (
          <ArchiveBossCreateExternalUser
            onClose={() => setCreateDialog(false)}
          />
        )}
      </div>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Søk etter brukernavn, navn eller e-post"
          aria-label="Søk etter eksterne brukere"
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
        <p> Laster eksterne brukere... </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th> Brukernavn </th>
              <th> Navn </th>
              <th> Tilgangsnivå </th>
              <th> Status </th>
              <th> Handlinger </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <ArchiveBossItem<ExternalUserDto>
                key={user.externalUserId.id}
                dtoObject={user}
                columns={[
                  user.username,
                  user.fullName || <span className={styles.muted}>–</span>,
                  securityLevelLabel(user.securityLevel),
                  user.isActive ? (
                    "Aktiv"
                  ) : (
                    <span className={styles.muted}>Deaktivert</span>
                  ),
                ]}
                editPopUp={editingId === user.externalUserId.id}
                onDelete={onDelete}
                onPatch={onPatch}
                onClose={onClose}
                onEdit={(u) => setEditingId(u.externalUserId.id)}
                EditSchema={ArchiveBossEditExternalUserSchema}
                deleteWarningMessage={`Er du sikker på at du vil slette ${user.username}? Brukeren vil ikke lenger kunne logge inn.`}
                actions={
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => setResetPasswordUser(user)}
                    className={styles.iconTextButton}
                  >
                    <KeyRound size={16} aria-hidden="true" />
                    Nytt passord
                  </Button>
                }
              />
            ))}
          </tbody>
        </table>
      )}
      {resetPasswordUser && (
        <ArchiveBossResetExternalUserPassword
          user={resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
        />
      )}
    </div>
  );
}
