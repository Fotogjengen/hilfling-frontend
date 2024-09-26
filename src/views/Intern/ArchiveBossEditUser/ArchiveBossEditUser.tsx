import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SamfundetUserApi } from "../../../utils/api/SamfundetUserApi";
import { SamfundetUser } from "../../../../generated";
import {
  Button,
  FormControl,
  FormLabel,
  Paper,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./ArchiveBossEditUser.module.css";

const ArchiveBossEditUser = () => {
  const [user, setUser] = useState<SamfundetUser>({});
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    SamfundetUserApi.getById(id || "")
      .then((res) => {
        setUser(res);
        setIsLoading(false);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEditUserClick = () => {
    SamfundetUserApi.patch(user).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className={styles.container}>
      {!isLoading ? (
        <Paper className={styles.form}>
          {/* <Button>sjekk</Button> */}
          <FormControl>
            <FormLabel>Fornavn:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />

            <FormLabel>Etternavn:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />

            <FormLabel>Telefonnummer:</FormLabel>
            <TextField
              // className={styles.input}
              required
              type="number"
              value={user?.phoneNumber?.value}
              onChange={(e) =>
                setUser({ ...user, phoneNumber: { value: e.target.value } })
              }
            />

            <FormLabel>Email:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.email?.value}
              onChange={(e) =>
                setUser({ ...user, email: { value: e.target.value } })
              }
            />

            {/* <FormLabel>Passord:</FormLabel>
          <TextField
            type="password"
            required
            value={user?.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          /> */}

            <Button
              onClick={handleEditUserClick}
              type="button"
              variant="contained"
              color="primary"
              sx={{ marginTop: "5px", margin: "5px auto" }}
              // className={styles.submitButton}
            >
              Oppdater bruker
            </Button>
          </FormControl>
        </Paper>
      ) : (
        <h1>Loading...</h1>
      )}
      <Link className={styles.backButton} to={"/intern/arkivsjef"}>
        <Button>Tilbake</Button>
      </Link>
    </div>
  );
};

export default ArchiveBossEditUser;
