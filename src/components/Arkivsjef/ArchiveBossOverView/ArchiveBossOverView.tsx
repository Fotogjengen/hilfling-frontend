import React, { useEffect, useState } from "react";
import { PhotoGangBanger } from "../../../../generated";
import { Button, Paper } from "@mui/material";
import styles from "./ArchiveBossOverView.module.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { PhotoGangBangerApi } from "../../../utils/api/PhotoGangBangerApi";

interface Props {
  setOverview: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Row {
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
  profilePicturePath?: string;
  active?: boolean;
  pang?: boolean;
}

const ArchiveBossOverView = ({ setOverview }: Props) => {
  const [users, setUsers] = useState<PhotoGangBanger[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    PhotoGangBangerApi.getAll()
      .then((res) => {
        setUsers(res.data.currentList);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const mappedRows = users.map((user) => ({
        id: user?.photoGangBangerId?.id,
        firstName: user.samfundetUser?.firstName,
        lastName: user.samfundetUser?.lastName,
        username: user.samfundetUser?.username,
        phoneNumber: user.samfundetUser?.phoneNumber?.value,
        email: user.samfundetUser?.email?.value,
        active: user.isActive,
        pang: user.isPang,
      }));

      setRows(mappedRows);
    }
  }, [users]);

  const columns: GridColDef[] = [
    {
      field: "username",
      headerName: "Username",
      width: 120,
      headerClassName: styles.headerCell,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 120,
      headerClassName: styles.headerCell,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 120,
      headerClassName: styles.headerCell,
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      width: 120,
      headerClassName: styles.headerCell,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      headerClassName: styles.headerCell,
    },
    {
      field: "active",
      headerName: "Active",
      width: 120,
      headerClassName: styles.headerCell,
    },
    {
      field: "pang",
      headerName: "Pang",
      width: 120,
      headerClassName: styles.headerCell,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: styles.headerCell,
      renderCell: (params) => (
        <Link to={`/fg/archiveBoss/editUser/${params.row.id}`}>
          <Button>Edit</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className={styles.popup}>
      <Paper className={styles.container}>
        {!isLoading ? (
          <DataGrid
            className={styles.table}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        ) : (
          <h3>...Loading</h3>
        )}
        <div>
          <Button onClick={() => setOverview(false)}>Tilbake</Button>
        </div>
      </Paper>
    </div>
  );
};

export default ArchiveBossOverView;
