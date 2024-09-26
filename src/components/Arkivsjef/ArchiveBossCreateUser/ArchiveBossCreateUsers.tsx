import {
  Button,
  FormControl,
  FormLabel,
  Paper,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "./ArchiveBossCreateUser.module.css";
import { SamfundetUserApi } from "../../../utils/api/SamfundetUserApi";
import { SamfundetUser } from "../../../../generated";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";

interface Props {
  setCreateUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArchiveBossCreateUsers = ({ setCreateUser }: Props) => {
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);
  const [user, setUser] = useState<SamfundetUser>({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: {
      value: "",
    },
    email: {
      value: "",
    },
    profilePicturePath: "/images/profile/johndoe.png",
    sex: "Male",
    securityLevel: {
      securityLevelId: {
        id: "8214142f-7c08-48ad-9130-fd7ac6b23e51", //Opprette random id her?
      },
      securityLevelType: "PROFILE",
    },
  });

  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);

  useEffect(() => {
    const phoneNumberLength = 8;
    setIsPhoneNumberValid(
      user.phoneNumber?.value?.length === phoneNumberLength,
    );
  }, [user.phoneNumber?.value]);

  useEffect(() => {
    const newUsername =
      (user.firstName || "")?.toLowerCase().substring(0, 3) +
        (user.lastName || "")?.toLowerCase().substring(0, 2) || "";
    setUser({ ...user, username: newUsername });
  }, [user.firstName, user.lastName]);

  const createUser = () => {
    console.log(user);
    SamfundetUserApi.post(user)
      .then((res) => {
        setUser({
          firstName: "",
          lastName: "",
          phoneNumber: { value: "" },
          email: { value: "" },
        });
        console.log(res);
        setOpen(true);
        setSeverity(severityEnum.SUCCESS);
        setMessage(`Bruker ble opprettet`);
      })
      .catch((err) => {
        console.error(err);
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(`Det oppsto en feil, bruker ble ikke opprettet`);
      });
    //console.log(response);
    // Optionally reset the form
  };

  const handleCreateUserClick = () => {
    if (isPhoneNumberValid) {
      createUser();
    }
  };

  //   const sjekk = async () => {
  //     try {
  //      const response = await
  //      SamfundetUserApi.getAll()
  //        .then((res) => console.log(res.data))
  //        .catch((err) => console.log(err));
  //     } catch (error) {

  //     }
  //   };

  //   const handleSjekk = () => {
  //     sjekk().catch((e) => console.error(e));
  //   };
  return (
    <div className={styles.popup}>
      <Paper className={styles.container}>
        {/* <Button>sjekk</Button> */}
        <FormControl>
          <FormLabel>Fornavn:</FormLabel>
          <TextField
            className={styles.input}
            required
            value={user?.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />

          <FormLabel>Etternavn:</FormLabel>
          <TextField
            className={styles.input}
            required
            value={user?.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />

          <FormLabel>Telefonnummer:</FormLabel>
          <TextField
            className={styles.input}
            required
            type="number"
            value={user?.phoneNumber?.value}
            onChange={(e) =>
              setUser({ ...user, phoneNumber: { value: e.target.value } })
            }
          />

          <FormLabel>Email:</FormLabel>
          <TextField
            className={styles.input}
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
            onClick={handleCreateUserClick}
            type="button"
            variant="contained"
            color="primary"
            sx={{ marginTop: "5px", margin: "5px auto" }}
            className={styles.submitButton}
          >
            Lag bruker
          </Button>

          <Button onClick={() => setCreateUser(false)}>Tilbake</Button>
        </FormControl>
      </Paper>
    </div>
  );
};

export default ArchiveBossCreateUsers;
