import {
  Button,
  FormControl,
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
import { PhotoGangBanger } from "../../../../generated";
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
      value: "H2018",
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

  // Email validation regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneNumberRegex = /^[1-9]\d{7}$/;

  const availableSemesters = [
    "V2018",
    "H2018",
    "V2019",
    "H2019",
    "V2020",
    "H2020",
    "V2021",
    "H2021",
    "V2022",
    "H2022",
    "V2023",
    "H2023",
    "V2024",
    "H2024",
    "V2025",
    "H2025",
  ];
  // fetch semesters dynamicaly

  useEffect(() => {
    //fetch postions
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
    console.log(user);
    PhotoGangBangerApi.post(user)
      .then((res) => {
        setUser(initialUserState);
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
        <FormControl>
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
              user.samfundetUser?.phoneNumber?.value !== "" &&
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
            className={styles.input}
            value={user.semesterStart?.value}
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

          {/* <FormLabel>Passord:</FormLabel>
          <TextField
            type="password"
            required
            value={user?.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          /> */}
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
        </FormControl>
      </Paper>
    </div>
  );
};

export default ArchiveBossCreateUsers;
