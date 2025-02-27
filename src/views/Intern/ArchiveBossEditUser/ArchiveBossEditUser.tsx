import React, { useContext, useEffect, useState } from "react";
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
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";

const ArchiveBossEditUser = () => {
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);
  const [user, setUser] = useState<SamfundetUser>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);

  // Email validation regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const { id } = useParams();

  useEffect(() => {
    const phoneNumberLength = 8;
    setIsPhoneNumberValid(
      user.phoneNumber?.value?.length === phoneNumberLength,
    );
  }, [user.phoneNumber?.value]);

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

  useEffect(() => {
    if (!user.email?.value) {
      setIsEmailValid(false);
      setEmailError("");
    } else if (!emailRegex.test(user.email.value)) {
      setIsEmailValid(false);
      setEmailError("Ugyldig e-postadresse");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  }, [user.email?.value]);

  useEffect(() => {
    if (!user.phoneNumber?.value) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("");
    } else if (user.phoneNumber?.value.length !== 8) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("Telefonnummer må være 8 siffer");
    } else {
      setIsPhoneNumberValid(true);
      setPhoneNumberError("");
    }
  }, [user.phoneNumber?.value]);

  const handleEditUserClick = () => {
    if (isPhoneNumberValid && isEmailValid) {
      SamfundetUserApi.patch(user).catch((err) => {
        console.log(err);
      });
    } else {
      setOpen(true);
      setSeverity(severityEnum.ERROR);

      let errorMessage = "Kan ikke opprette bruker: ";
      if (!isPhoneNumberValid) {
        errorMessage += "Telefonnummer må være 8 siffer. ";
      }
      if (!isEmailValid) {
        errorMessage += "E-postadressen er ugyldig.";
      }

      setMessage(errorMessage);
    }
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
              value={user?.phoneNumber?.value}
              error={user.phoneNumber?.value !== "" && !isEmailValid}
              helperText={phoneNumberError}
              type="number"
              onChange={(e) =>
                setUser({ ...user, phoneNumber: { value: e.target.value } })
              }
            />

            <FormLabel>Email:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.email?.value}
              error={user.email?.value !== "" && !isEmailValid}
              helperText={emailError}
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
