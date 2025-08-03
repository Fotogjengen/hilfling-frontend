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
import { PhotoGangBanger, PositionDto } from "../../../../generated";
import { PositionApi } from "../../../utils/api/PositionApi";
// import { SecurityLevelDto } from "../../../../generated/models/SecurityLevelDto";
// import { relationShipStatus } from "../../../../generated/models/PhotoGangBangerDto";

interface Props {
  setCreateUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArchiveBossCreateUsers = ({ setCreateUser }: Props) => {
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);
  const initialUserState: PhotoGangBanger = {
    relationShipStatus: "single", // remove this in the future
    semesterStart: {
      value: "",
    },
    address: "",
    zipCode: "",
    city: "",
    position: {
      title: "Gjengsjef",
      email: {
        value: "fg-web@samfundet.no",
      },
      positionId: {
        id: "bdd0cf5a-c952-41b8-8b83-c071da51f946",
      },
    },
    isActive: true,
    isPang: false,
    samfundetUser: {
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
      sex: "Male", // remove this in the future
      securityLevel: {
        securityLevelId: {
          id: "8214142f-7c08-48ad-9130-fd7ac6b23e51",
        },
        securityLevelType: "FG",
      },
    },
  };
  const [user, setUser] = useState<PhotoGangBanger>(initialUserState);

  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [positions, setPositions] = useState<PositionDto[]>([]);

  // Email validation regex pattern
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

  const createUser = () => {
    PhotoGangBangerApi.post(user)
      .then(() => {
        setUser(initialUserState);
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
      if (!isPhoneNumberValid) {
        errorMessage += "Telefonnummer er ugyldig. ";
      }
      if (!isEmailValid) {
        errorMessage += "E-postadressen er ugyldig.";
      }

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
          value={user?.samfundetUser?.username}
          onChange={(e) =>
            setUser({
              ...user,
              samfundetUser: {
                ...user.samfundetUser,
                username: e.target.value,
              },
            })
          }
        />

        <FormLabel>Fornavn:</FormLabel>
        <TextField
          className={styles.input}
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
          className={styles.input}
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

        <FormLabel> Telefonnummer: </FormLabel>
        <TextField
          className={styles.input}
          required
          value={user?.samfundetUser?.phoneNumber?.value}
          error={
            user.samfundetUser?.phoneNumber?.value !== "" && !isPhoneNumberValid
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

        <FormLabel> Email: </FormLabel>
        <TextField
          className={styles.input}
          required
          value={user?.samfundetUser?.email?.value}
          error={user.samfundetUser?.email?.value !== "" && !isEmailValid}
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
        <FormLabel>Adresse:</FormLabel>
        <TextField
          className={styles.input}
          value={user.address}
          onChange={(e) =>
            setUser({
              ...user,
              address: e.target.value,
            })
          }
        />

        <FormLabel>Postnummer:</FormLabel>
        <TextField
          className={styles.input}
          value={user.zipCode}
          onChange={(e) =>
            setUser({
              ...user,
              zipCode: e.target.value,
            })
          }
        />

        <FormLabel>By:</FormLabel>
        <TextField
          className={styles.input}
          value={user.city}
          onChange={(e) =>
            setUser({
              ...user,
              city: e.target.value,
            })
          }
        />

        <FormLabel>Startsemester:</FormLabel>
        <Select
          name="semesterStart"
          className={styles.input}
          value={user.semesterStart?.value || ""}
          onChange={(e) =>
            setUser({
              ...user,
              semesterStart: {
                value: e.target.value,
              },
            })
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
          value={
            positions.length > 0 ? user.position?.positionId?.id || "" : ""
          }
          onChange={(e) => {
            const selectedPosition = positions.find(
              (pos) => pos.positionId?.id === e.target.value,
            );
            setUser({
              ...user,
              position: selectedPosition,
            });
          }}
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
            // sx={{ marginTop: "5px", margin: "5px auto" }}
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
