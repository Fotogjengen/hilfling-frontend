import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./profile.module.css";
import axios from "axios";
import EditProfilepic from "@/components/MyProfile/EditProfilepic/EditProfilpic";
// import { AlertContext, severityEnum } from "../../contexts/AlertContext";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/profile",
)({
  component: Profile,
});

interface UserInfo {
  profilePicure: string;
  firstName: string;
  lastName: string;
  userName: string;
  adress: string;
  zip: string;
  city: string;
  phoneNumber: string;
  // eMail: string ;
  samfundetEMail: string;
  currentPosition: string | " ";
  formerPositions: string[] | [" "];
  role?: string | " "; // "Fotograf" or "Web"
  admissionSemester?: string;
}

const emptyUser: UserInfo = {
  profilePicure:
    "https://media1.tenor.com/images/79f8be09f39791c6462d30c5ce42e3be/tenor.gif?itemid=18386674",
  firstName: " ",
  lastName: " ",
  userName: " ",
  adress: " ",
  zip: " ",
  city: " ",
  phoneNumber: " ",
  // eMail: " " ,
  samfundetEMail: " ",
  currentPosition: " ",
  formerPositions: [" "],
  role: " ",
  admissionSemester: " ",
};

//http://localhost:8000/photo_gang_bangers/7a89444f-25f6-44d9-8a73-94587d72b839

function Profile() {
  const webPositions: string[] = [
    "websjef",
    "benkmester",
    "opplæringsannsvarlig",
    "webAdmin",
    "web",
  ];

  const [currentUser, setCurrentUser] = useState<UserInfo>(emptyUser);

  const [isHovered, setHoverVariable] = useState(false);
  const [editProfilepic, setEditProfilepic] = useState(false);

  useEffect(() => {
    const getUser = () => {
      //Make api-call
      const url =
        "http://localhost:8000/photo_gang_bangers/7a89444f-25f6-44d9-8a73-94587d72b839"; //For testing purpose. Has to be modified to make corrrect api call

      axios
        .get(url)

        .then((response) => {
          const profilePicure = response.data.samfundetUser.profilePicturePath;
          const firstName = response.data.samfundetUser.firstName;
          const lastName = response.data.samfundetUser.lastName;
          const userName = response.data.samfundetUser.username;
          const adress = response.data.address;
          const zip = response.data.zipCode;
          const city = response.data.city;
          const phoneNumber = response.data.samfundetUser.phoneNumber.value;
          // const eMail= response.data.samfundetUser.email.value;
          const samfundetEMail = response.data.samfundetUser.email.value;
          const currentPosition = response.data.position.title;
          const formerPositions = [" "]; //Not supported yet
          const admissionSemester = response.data.semesterStart.value;
          //determine if web or fotograf
          let role = "Fotograf";
          // console.log(webPositions.includes(currentUser.currentPosition.toLowerCase()))

          if (webPositions.includes(currentPosition.toLowerCase())) {
            // settes the correct role i
            role = "Web";
          }

          setCurrentUser({
            profilePicure,
            firstName,
            lastName,
            userName,
            adress,
            zip,
            city,
            phoneNumber,
            samfundetEMail,
            currentPosition,
            formerPositions,
            role,
            admissionSemester,
          });
        })

        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    };

    getUser();
  }, []);

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
            <EditProfilepic setEditProfilepic={setEditProfilepic} />
          )}
          <div
            className={styles.profilePicture}
            onMouseOver={() => setHoverVariable(true)}
            onMouseLeave={() => setHoverVariable(false)}
          >
            <div className={styles.profilePictureImg}>
              {!isHovered && (
                <img
                  src={currentUser.profilePicure}
                  alt="Profile"
                  height="225"
                  width="225"
                />
              )}

              {isHovered && (
                <button
                  className={styles.newProfilePictureButton}
                  onClick={() => setEditProfilepic(true)}
                >
                  Legg til nytt profilbilde
                </button>
              )}
            </div>
          </div>
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
              <div>{"Samfundet e-post: " + currentUser.samfundetEMail}</div>
              {/* <div>  
                {"e-post: " + currentUser.eMail}
              </div> */}
              <div>{"Telefon: " + currentUser.phoneNumber}</div>
              <div>
                {"Adresse: " +
                  currentUser.adress +
                  ", " +
                  currentUser.zip +
                  " " +
                  currentUser.city}
              </div>
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
