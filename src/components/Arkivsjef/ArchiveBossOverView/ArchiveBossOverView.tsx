import React, { useEffect, useState } from "react";
import { SamfundetUserApi } from "../../../utils/api/SamfundetUserApi";
import { SamfundetUser } from "../../../../generated";
import { Button, Paper } from "@mui/material";
import styles from "./ArchiveBossOverView.module.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

interface Props {
  setOverview: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Row {
  samfundetUserId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
  profilePicturePath?: string;
  sex?: string;
  securityLevel?: string;
}

const ArchiveBossOverView = ({ setOverview }: Props) => {
  const [users, setUsers] = useState<SamfundetUser[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SamfundetUserApi.getAll()
      .then((res) => {
        setUsers(res.data.currentList);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log(users);
    if (users.length > 0) {
      const mappedRows = users.map((user) => ({
        id: user.samfundetUserId?.id || "",
        samfundetUserId: user.samfundetUserId?.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phoneNumber: user.phoneNumber?.value,
        email: user.email?.value,
        profilePicturePath: user.profilePicturePath,
        sex: user.sex,
        securityLevel: user.securityLevel?.securityLevelType,
      }));

      setRows(mappedRows);
      console.log(rows);
    }
  }, [users]);

  const columns: GridColDef[] = [
    {
      field: "samfundetUserId",
      headerName: "ID",
      width: 180,
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
      field: "username",
      headerName: "Username",
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
    // {
    //   field: "profilePicturePath",
    //   headerName: "Profile Picture",
    //   width: 120,
    //   headerClassName: styles.headerCell,
    // },
    // {
    //   field: "sex",
    //   headerName: "Sex",
    //   width: 120,
    //   headerClassName: styles.headerCell,
    // },
    {
      field: "securityLevel",
      headerName: "Security Level",
      width: 100,
      headerClassName: styles.headerCell,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerClassName: styles.headerCell,
      renderCell: (params) => (
        <Link to={`/intern/arkivsjef/editUser/${params.row.id}`}>
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
        <Button onClick={() => setOverview(false)}>Tilbake</Button>
      </Paper>

      {/* <Paper className={styles.container}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography>Navn</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>E-post</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Telefon</Typography>
          </Grid>

          {!isLoading ? (
            users?.map((u) => (
              <Grid container spacing={2} key={u.samfundetUserId?.id}>
                <Grid item xs={2}>
                  <Typography>{u.firstName}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>{u.email?.value}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>{u.phoneNumber?.value}</Typography>
                </Grid>
              </Grid>
            ))
          ) : (
            <Grid item xs={12} key={"loading"}>
              <Typography>Loading...</Typography>
            </Grid>
          )}
        </Grid>
        <Button onClick={() => setOverview(false)}>Tilbake</Button>
      </Paper> */}
    </div>
  );
};

export default ArchiveBossOverView;
