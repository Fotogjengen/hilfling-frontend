import { useContext, useEffect, useState } from "react";
import styles from "./ArchiveBossCreateUser.module.css";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import { PhotoGangBangerApi } from "../../../utils/api/PhotoGangBangerApi";
import { PhotoGangBangerDto, PositionDto } from "@/../generated";
import { PositionApi } from "../../../utils/api/PositionApi";
import { TextInput } from "@/components/ui/input/TextInput";
import { Select } from "@/components/ui/input/Select";
import { Button } from "@/components/ui/input/Button";

interface Props {
  setCreateUser: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneNumberRegex = /^[1-9]\d{7}$/;

function generateAvailableSemesters() {
  const currentYear = new Date().getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1].flatMap((year) => [
    `V${year}`,
    `H${year}`,
  ]);
}

const availableSemesters = generateAvailableSemesters();

function ArchiveBossCreateUsers({ setCreateUser }: Props) {
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  const [user, setUser] = useState(initialUserState);
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [positions, setPositions] = useState<PositionDto[]>([]);

  useEffect(() => {
    void PositionApi.getAll()
      .then((res) => setPositions(res.data.currentList))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (user.phoneNumber && phoneNumberRegex.test(user.phoneNumber)) {
      setIsPhoneNumberValid(true);
      setPhoneNumberError("");
    } else {
      setIsPhoneNumberValid(false);
      setPhoneNumberError(user.phoneNumber ? "Ugyldig telefonnummer" : "");
    }
  }, [user.phoneNumber]);

  useEffect(() => {
    if (user.email && emailRegex.test(user.email)) {
      setIsEmailValid(true);
      setEmailError("");
    } else {
      setIsEmailValid(false);
      setEmailError(user.email ? "Ugyldig e-postadresse" : "");
    }
  }, [user.email]);

  const createUser = () => {
    const dto: PhotoGangBangerDto = {
      ...user,
      photoGangBangerId: { id: crypto.randomUUID() },
    };
    void PhotoGangBangerApi.post(dto)
      .then(() => {
        setUser(initialUserState);
        setSelectedPositionId("");
        setOpen(true);
        setSeverity(severityEnum.SUCCESS);
        setMessage("Bruker ble opprettet");
      })
      .catch((err) => {
        console.error(err);
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage("Det oppsto en feil, bruker ble ikke opprettet");
      });
  };

  const handleCreateUserClick = () => {
    if (isPhoneNumberValid && isEmailValid) {
      createUser();
    } else {
      let errorMessage = "Kan ikke opprette bruker: ";
      if (!isPhoneNumberValid) errorMessage += "Telefonnummer er ugyldig. ";
      if (!isEmailValid) errorMessage += "E-postadressen er ugyldig.";
      setOpen(true);
      setSeverity(severityEnum.ERROR);
      setMessage(errorMessage);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.container}>
        <TextInput
          label="Brukernavn"
          required
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <TextInput
          label="Fornavn"
          required
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />
        <TextInput
          label="Etternavn"
          required
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />
        <TextInput
          label="Telefonnummer"
          required
          value={user.phoneNumber}
          error={
            user.phoneNumber !== "" && !isPhoneNumberValid
              ? phoneNumberError
              : undefined
          }
          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
        />
        <TextInput
          label="Email"
          required
          value={user.email}
          error={user.email !== "" && !isEmailValid ? emailError : undefined}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <Select
          label="Startsemester"
          value={user.semesterStart.value}
          onValueChange={(value) =>
            setUser({ ...user, semesterStart: { value } })
          }
          options={availableSemesters.map((s) => ({ label: s, value: s }))}
        />
        <Select
          label="Verv"
          value={positions.length > 0 ? selectedPositionId : ""}
          onValueChange={setSelectedPositionId}
          options={positions.map((p) => ({
            label: p.title ?? "",
            value: p.positionId?.id ?? "",
          }))}
        />

        <div className={styles.nav_buttons}>
          <Button onClick={handleCreateUserClick} type="button">
            Lag bruker
          </Button>
          <Button variant="neutral" onClick={() => setCreateUser(false)}>
            Tilbake
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ArchiveBossCreateUsers;
