import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PhotoGangBangerDto } from "../../../../generated";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  TextField,
} from "@mui/material";
import styles from "./ArchiveBossEditUser.module.css";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import { PhotoGangBangerApi } from "../../../utils/api/PhotoGangBangerApi";
import { useNavigate } from "react-router-dom";

const ArchiveBossEditUser = () => {
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);
  const [user, setUser] = useState<PhotoGangBangerDto>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const navigate = useNavigate();

  // Email validation regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneNumberRegex = /^[1-9]\d{7}$/;

  const { id } = useParams();

  useEffect(() => {
    const phoneNumberLength = 8;
    setIsPhoneNumberValid(
      user.samfundetUser?.phoneNumber?.value?.length === phoneNumberLength,
    );
  }, [user.samfundetUser?.phoneNumber?.value]);

  useEffect(() => {
    PhotoGangBangerApi.getById(id || "")
      .then((res) => {
        setUser(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!user.samfundetUser?.email?.value) {
      setIsEmailValid(false);
      setEmailError("");
    } else if (!emailRegex.test(user.samfundetUser?.email.value)) {
      setIsEmailValid(false);
      setEmailError("Ugyldig e-postadresse");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  }, [user.samfundetUser?.email?.value]);

  useEffect(() => {
    if (!user.samfundetUser?.phoneNumber?.value) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("");
    } else if (!phoneNumberRegex.test(user.samfundetUser?.phoneNumber.value)) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("Ugyldig telefonnummer");
    } else {
      setIsPhoneNumberValid(true);
      setPhoneNumberError("");
    }
  }, [user.samfundetUser?.phoneNumber?.value]);

  const handleEditUserClick = () => {
    if (isPhoneNumberValid && isEmailValid) {
      PhotoGangBangerApi.patch(user)
        .then(() => {
          setOpen(true);
          setSeverity(severityEnum.SUCCESS);
          setMessage(`Bruker ble oppdatert`);
        })
        .catch((err) => {
          console.log(err);
          setOpen(true);
          setSeverity(severityEnum.ERROR);
          setMessage(`Det oppsto en feil, bruker ble ikke opdatert`);
        });
    } else {
      setOpen(true);
      setSeverity(severityEnum.ERROR);

      let errorMessage = "Kan ikke opprette bruker: ";
      if (!isPhoneNumberValid) {
        errorMessage += "Telefonnummeret er ugyldig.";
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
        <Paper
          className={styles.form}
          sx={{
            width: "70%",
          }}
        >
          {/* <Button>sjekk</Button> */}
          <FormControl
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FormLabel>Fornavn:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.samfundetUser?.firstName}
              onChange={(e) =>
                setUser({
                  ...user,
                  samfundetUser: {
                    ...user.samfundetUser,
                    firstName: e.target.value,
                  },
                })
              }
            />

            <FormLabel>Etternavn:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.samfundetUser?.lastName}
              onChange={(e) =>
                setUser({
                  ...user,
                  samfundetUser: {
                    ...user.samfundetUser,
                    lastName: e.target.value,
                  },
                })
              }
            />

            <FormLabel>Telefonnummer:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.samfundetUser?.phoneNumber?.value}
              error={
                user?.samfundetUser?.phoneNumber?.value !== "" &&
                !isPhoneNumberValid
              }
              helperText={phoneNumberError}
              onChange={(e) =>
                setUser({
                  ...user,
                  samfundetUser: {
                    ...user.samfundetUser,
                    phoneNumber: { value: e.target.value },
                  },
                })
              }
            />

            <FormLabel>Email:</FormLabel>
            <TextField
              // className={styles.input}
              required
              value={user?.samfundetUser?.email?.value}
              error={user?.samfundetUser?.email?.value !== "" && !isEmailValid}
              helperText={emailError}
              onChange={(e) =>
                setUser({
                  ...user,
                  samfundetUser: {
                    ...user.samfundetUser,
                    email: { value: e.target.value },
                  },
                })
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={user?.isActive || false}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Aktiv"
              sx={{ marginTop: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={user?.isPang || false}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      isPang: e.target.checked,
                    })
                  }
                />
              }
              label="Er Pang"
              sx={{ marginTop: 1, marginBottom: 2 }}
            />
            <div className={styles.action_buttons}>
              <Button
                onClick={handleEditUserClick}
                type="button"
                variant="contained"
                color="primary"

                // className={styles.submitButton}
              >
                Oppdater bruker
              </Button>
              <Button
                className={styles.backButton}
                onClick={() => navigate(-1)}
              >
                Tilbake
              </Button>
            </div>
          </FormControl>
        </Paper>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default ArchiveBossEditUser;
