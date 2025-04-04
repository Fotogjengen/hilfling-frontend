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
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");


  // Email validation regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneNumberRegex = /^[1-9]\d{7}$/;



  useEffect(() => {
    if (!user.phoneNumber?.value) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("")
      

    } else if (!phoneNumberRegex.test(user.phoneNumber.value)) {
      setIsPhoneNumberValid(false);
      setPhoneNumberError("Ugyldig telefonnummer");
      
    } else {
      setIsPhoneNumberValid(true);
      setPhoneNumberError("");
      
    }

  }, [user.phoneNumber?.value]);

  useEffect(() => {
    const newUsername =
      (user.firstName || "")?.toLowerCase().substring(0, 3) +
        (user.lastName || "")?.toLowerCase().substring(0, 2) || "";
    setUser({ ...user, username: newUsername });
  }, [user.firstName, user.lastName]);

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

          <FormLabel> Telefonnummer: </FormLabel>
          <TextField
            className={styles.input}
            required
            value={user?.phoneNumber?.value}
            error={user.phoneNumber?.value !== "" && !isPhoneNumberValid}
            helperText={phoneNumberError}
            onChange={(e) =>
              setUser({ ...user, phoneNumber: { value: e.target.value } })
            }
          />

          <FormLabel> Email: </FormLabel>
          <TextField
            className={styles.input}
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
          <div className= {styles.nav_buttons} >

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

            <Button onClick={() => setCreateUser(false)}
              sx={{ width : "50%"
                  }}
              >
              Tilbake
              </Button>

          </div>
        </FormControl>
      </Paper>
    </div>
  );
};

export default ArchiveBossCreateUsers;
