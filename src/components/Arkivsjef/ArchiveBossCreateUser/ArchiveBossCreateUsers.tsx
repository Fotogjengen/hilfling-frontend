import {
  Button,
  FormLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "./ArchiveBossCreateUser.module.css";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import { PhotoGangBangerApi } from "../../../utils/api/PhotoGangBangerApi";
import { PhotoGangBangerDto, PositionDto } from "../../../../generated";
import { PositionApi } from "../../../utils/api/PositionApi";

interface Props {
  setCreateUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArchiveBossCreateUsers = ({ setCreateUser }: Props) => {
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  const initialUserState = {
    semesterStart: { value: "" },
    isActive: true,
    isPang: false,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profilePicture: "/images/profile/johndoe.png",
    phoneNumber: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [positions, setPositions] = useState<PositionDto[]>([]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneNumberRegex = /^[1-9]\d{7}$/;

  function generateAvailableSemesters() {
    const currentYear = new Date().getFullYear();
    const semesters = [];
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      semesters.push(`V${year}`);
      semesters.push(`H${year}`);
    }
    return semesters;
  }

  const availableSemesters = generateAvailableSemesters();

  useEffect(() => {
    PositionApi.getAll()
      .then((res) => {
        setPositions(res.data.currentList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!user.phoneNumber) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("");
    } else if (!phoneNumberRegex.test(user.phoneNumber)) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("Ugyldig telefonnummer");
    } else {
      setIsPhoneNumberValid(true);
      setPhoneNumberError("");
    }
  }, [user.phoneNumber]);

  useEffect(() => {
    if (!user.email) {
      setIsEmailValid(false);
      setEmailError("");
    } else if (!emailRegex.test(user.email)) {
      setIsEmailValid(false);
      setEmailError("Ugyldig e-postadresse");
    } else {
      setIsEmailValid(true);
      setEmailError("");
    }
  }, [user.email]);

  const createUser = () => {
    const dto: PhotoGangBangerDto = {
      ...user,
      photoGangBangerId: { id: crypto.randomUUID() },
    };
    PhotoGangBangerApi.post(dto)
      .then(() => {
        setUser(initialUserState);
        setSelectedPositionId("");
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
  };

  const handleCreateUserClick = () => {
    if (isPhoneNumberValid && isEmailValid) {
      createUser();
    } else {
      setOpen(true);
      setSeverity(severityEnum.ERROR);

      let errorMessage = "Kan ikke opprette bruker: ";
      if (!isPhoneNumberValid) errorMessage += "Telefonnummer er ugyldig. ";
      if (!isEmailValid) errorMessage += "E-postadressen er ugyldig.";

      setMessage(errorMessage);
    }
  };

  return (
    <div className={styles.popup}>
      <Paper className={styles.container}>
        <FormLabel>Brukernavn:</FormLabel>
        <TextField
          className={styles.input}
          required
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />

        <FormLabel>Fornavn:</FormLabel>
        <TextField
          className={styles.input}
          required
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />

        <FormLabel>Etternavn:</FormLabel>
        <TextField
          className={styles.input}
          required
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />

        <FormLabel>Telefonnummer:</FormLabel>
        <TextField
          className={styles.input}
          required
          value={user.phoneNumber}
          error={user.phoneNumber !== "" && !isPhoneNumberValid}
          helperText={phoneNumberError}
          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
        />

        <FormLabel>Email:</FormLabel>
        <TextField
          className={styles.input}
          required
          value={user.email}
          error={user.email !== "" && !isEmailValid}
          helperText={emailError}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <FormLabel>Startsemester:</FormLabel>
        <Select
          name="semesterStart"
          className={styles.input}
          value={user.semesterStart.value}
          onChange={(e) =>
            setUser({ ...user, semesterStart: { value: e.target.value } })
          }
        >
          {availableSemesters.map((semester) => (
            <MenuItem key={semester} value={semester}>
              {semester}
            </MenuItem>
          ))}
        </Select>

        <FormLabel>Verv:</FormLabel>
        <Select
          name="position"
          className={styles.input}
          value={positions.length > 0 ? selectedPositionId : ""}
          onChange={(e) => setSelectedPositionId(e.target.value)}
        >
          {positions.map((position) => (
            <MenuItem
              key={position.positionId?.id}
              value={position.positionId?.id}
            >
              {position.title}
            </MenuItem>
          ))}
        </Select>

        <div className={styles.nav_buttons}>
          <Button
            onClick={handleCreateUserClick}
            type="button"
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            Lag bruker
          </Button>

          <Button onClick={() => setCreateUser(false)} sx={{ width: "50%" }}>
            Tilbake
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default ArchiveBossCreateUsers;
