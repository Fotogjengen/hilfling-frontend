import { createFileRoute, useRouter } from "@tanstack/react-router";

import { useContext, useEffect, useState } from "react";
import { PhotoGangBangerDto } from "@/../generated";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  TextField,
} from "@mui/material";
import styles from "./archiveBossEditUser.module.css";
import { AlertContext, severityEnum } from "@/contexts/AlertContext";
import { PhotoGangBangerApi } from "@/utils/api/PhotoGangBangerApi";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/archiveBoss/editUser/$userId",
)({
  component: ArchiveBossEditUser,
});

function ArchiveBossEditUser() {
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);
  const [user, setUser] = useState<PhotoGangBangerDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneNumberRegex = /^[1-9]\d{7}$/;

  const { userId: id } = Route.useParams();

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
    if (!user?.email) {
      setIsEmailValid(false);
      setEmailError("");
    } else if (!emailRegex.test(user.email)) {
      setIsEmailValid(false);
      setEmailError("Ugyldig e-postadresse");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  }, [user?.email]);

  useEffect(() => {
    const phoneNumberLength = 8;
    if (!user?.phoneNumber) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("");
    } else if (
      !phoneNumberRegex.test(user.phoneNumber) ||
      user.phoneNumber.length !== phoneNumberLength
    ) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("Ugyldig telefonnummer");
    } else {
      setIsPhoneNumberValid(true);
      setPhoneNumberError("");
    }
  }, [user?.phoneNumber]);

  const handleEditUserClick = () => {
    if (!user) return;

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
      if (!isPhoneNumberValid) errorMessage += "Telefonnummeret er ugyldig.";
      if (!isEmailValid) errorMessage += "E-postadressen er ugyldig.";

      setMessage(errorMessage);
    }
  };

  const handleBackClick = () => {
    router.history.back();
  };

  return (
    <div className={styles.container}>
      {!isLoading && user ? (
        <Paper className={styles.form} sx={{ width: "70%" }}>
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
              required
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />

            <FormLabel>Etternavn:</FormLabel>
            <TextField
              required
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />

            <FormLabel>Telefonnummer:</FormLabel>
            <TextField
              required
              value={user.phoneNumber}
              error={user.phoneNumber !== "" && !isPhoneNumberValid}
              helperText={phoneNumberError}
              onChange={(e) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
            />

            <FormLabel>Email:</FormLabel>
            <TextField
              required
              value={user.email}
              error={user.email !== "" && !isEmailValid}
              helperText={emailError}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={user.isActive}
                  onChange={(e) =>
                    setUser({ ...user, isActive: e.target.checked })
                  }
                />
              }
              label="Aktiv"
              sx={{ marginTop: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={user.isPang}
                  onChange={(e) =>
                    setUser({ ...user, isPang: e.target.checked })
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
              >
                Oppdater bruker
              </Button>
              <Button className={styles.backButton} onClick={handleBackClick}>
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
}

export default ArchiveBossEditUser;
