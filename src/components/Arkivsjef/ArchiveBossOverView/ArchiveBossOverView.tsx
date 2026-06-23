import { useEffect, useState } from "react";
import { PhotoGangBangerDto } from "@/../generated";
import styles from "./ArchiveBossOverView.module.css";
import { Link } from "@tanstack/react-router";
import { PhotoGangBangerApi } from "@/utils/api/PhotoGangBangerApi";
import { Button } from "@/components/ui/input/Button";
import { Pagination } from "@/components/ui/navigation/Pagination";

interface Props {
  setOverview: React.Dispatch<React.SetStateAction<boolean>>;
}

const PAGE_SIZE = 5;

function ArchiveBossOverView({ setOverview }: Props) {
  const [users, setUsers] = useState<PhotoGangBangerDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    void PhotoGangBangerApi.getAll()
      .then((page) => {
        setUsers(page.currentList ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const pageUsers = users.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className={styles.popup}>
      <div className={styles.container}>
        {isLoading ? (
          <p>Laster...</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.headerCell}>Username</th>
                  <th className={styles.headerCell}>First name</th>
                  <th className={styles.headerCell}>Last name</th>
                  <th className={styles.headerCell}>Phone number</th>
                  <th className={styles.headerCell}>Email</th>
                  <th className={styles.headerCell}>Active</th>
                  <th className={styles.headerCell}>Pang</th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageUsers.map((user) => (
                  <tr key={user.photoGangBangerId?.id}>
                    <td className={styles.cell}>{user.username}</td>
                    <td className={styles.cell}>{user.firstName}</td>
                    <td className={styles.cell}>{user.lastName}</td>
                    <td className={styles.cell}>{user.phoneNumber}</td>
                    <td className={styles.cell}>{user.email}</td>
                    <td className={styles.cell}>
                      {user.isActive ? "Ja" : "Nei"}
                    </td>
                    <td className={styles.cell}>
                      {user.isPang ? "Ja" : "Nei"}
                    </td>
                    <td className={styles.cell}>
                      <Link
                        to="/fg/archiveBoss/editUser/$userId"
                        params={{ userId: user.photoGangBangerId?.id }}
                      >
                        <Button size="sm">Edit</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
        <Button variant="neutral" onClick={() => setOverview(false)}>
          Tilbake
        </Button>
      </div>
    </div>
  );
}

export default ArchiveBossOverView;
