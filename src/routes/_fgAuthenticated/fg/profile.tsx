import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./profile.module.css";
import type { PhotoGangBangerDto } from "@/../generated";
import { PhotoGangBangerApi } from "@/utils/api/PhotoGangBangerApi";
import { ProfileImage } from "@/components/ui/display/ProfileImage";
import { Button } from "@/components/ui/input/Button";
import EditProfilepic from "@/components/MyProfile/EditProfilepic/EditProfilpic";
// import { AlertContext, severityEnum } from "../../contexts/AlertContext";

export const Route = createFileRoute("/_fgAuthenticated/fg/profile")({
  component: Profile,
});

interface UserInfo {
  profilePicure: string;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  samfundetEMail: string;
  currentPosition: string;
  formerPositions: string[] | [" "];
  role?: string;
  admissionSemester?: string;
}

const emptyUser: UserInfo = {
  profilePicure: "",
  firstName: " ",
  lastName: " ",
  userName: " ",
  phoneNumber: " ",
  samfundetEMail: " ",
  currentPosition: " ",
  formerPositions: [" "],
  role: " ",
  admissionSemester: " ",
};

function toUserInfo(member: PhotoGangBangerDto): UserInfo {
  const positions = member.positions ?? [];
  const currentPosition =
    positions.find((position) => position.isActive)?.title ?? "";
  return {
    profilePicure: member.profilePicture,
    firstName: member.firstName,
    lastName: member.lastName,
    userName: member.username,
    phoneNumber: member.phoneNumber,
    samfundetEMail: member.email,
    currentPosition,
    formerPositions: positions
      .filter((position) => !position.isActive)
      .map((position) => position.title),
    role: [
      "websjef",
      "benkmester",
      "opplæringsannsvarlig",
      "webadmin",
      "web",
    ].includes(currentPosition.toLowerCase())
      ? "Web"
      : "Fotograf",
    admissionSemester: member.semesterStart?.value ?? "",
  };
}

function Profile() {
  const [currentUser, setCurrentUser] = useState<UserInfo>(emptyUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProfilepic, setEditProfilepic] = useState(false);

  useEffect(() => {
    let active = true;
    PhotoGangBangerApi.getMe()
      .then((member) => {
        if (active) setCurrentUser(toUserInfo(member));
      })
      .catch(() => {
        if (active)
          setError(
            "Kunne ikke hente profilen. Last siden på nytt for å prøve igjen.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p role="status">Henter profilen …</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div className={styles.mainCard}>
      <header className={styles.nameDisplay}>
        {currentUser?.firstName + " " + currentUser?.lastName || "loading ... "}
        <h2 className={styles.roleDisplay}>
          {currentUser?.role || "loading ... "}
        </h2>
      </header>
      <div className={styles.infoCard}>
        <div className={styles.card1}>
          {" "}
          {/* Contains profile picture and personal info*/}
          {editProfilepic && ( // Renders pop up for changing profile picture
            <EditProfilepic
              setEditProfilepic={setEditProfilepic}
              currentPicture={currentUser.profilePicure}
              onSaved={(member) => setCurrentUser(toUserInfo(member))}
            />
          )}
          <div className={styles.profilePicture}>
            <div className={styles.profilePictureImg}>
              <ProfileImage
                key={currentUser.profilePicure}
                src={currentUser.profilePicure}
                alt="Endre profilbilde"
                size={225}
                onClick={() => setEditProfilepic(true)}
              />
            </div>
          </div>
          <Button onClick={() => setEditProfilepic(true)}>
            Endre profilbilde
          </Button>
          <div className={styles.positions}>
            <h1 className={styles.positionsHeader}>{"Verv"}</h1>
            <h2 className={styles.positionsList}>
              {currentUser?.currentPosition || "Loading..."}
              <div>
                {currentUser?.formerPositions.map((position, index) => (
                  <div key={index}>{position}</div>
                ))}
              </div>
            </h2>
          </div>
        </div>

        <div className={styles.card2}>
          {" "}
          {/* Contains position and admission semester*/}
          <div className={styles.personalInformation}>
            <h1 className={styles.personalInformationHeader}>
              {"Personlig informasjon"}
            </h1>
            <h2 className={styles.personalInformationList}>
              <div>{"Brukernavn: " + currentUser.userName}</div>
              <div>{"E-post: " + currentUser.samfundetEMail}</div>
              <div>{"Telefon: " + currentUser.phoneNumber}</div>
            </h2>
          </div>
          <div className={styles.admissionSemester}>
            <h1 className={styles.admissionSemesterHeader}>{"Aktiv siden"}</h1>
            <h2 className={styles.admissionSemesterText}>
              {currentUser?.admissionSemester || "Loading..."}
            </h2>
          </div>
        </div>

        <div className={styles.card3}>
          <div className={styles.randomPictureImg}>
            <img
              src="https://foto.samfundet.no/media/alle/web/DIGGE/digge0982.jpg"
              alt="Profile"
              height="517"
              width="500"
            />{" "}
            {/* This should be changed to the photoobject varible when it is not hard coded anymore */}
            {/* <p> {photoObject}  </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
