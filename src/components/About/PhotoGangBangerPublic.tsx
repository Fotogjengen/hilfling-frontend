import styles from "./PhotoGangBangerPublic.module.css";
import { ProfileImage } from "@/components/ui/display/ProfileImage";

interface Props {
  image: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
}

const PhotoGangBangerPublic = ({
  firstName,
  lastName,
  position,
  image,
  email,
}: Props) => {
  const onClick = (): void => {
    alert("Hei");
  };

  const mailTo = "mailto:" + email;
  return (
    <div className={styles.profile}>
      <div className={styles.profileImage}>
        <ProfileImage alt={firstName} src={image} onClick={onClick} />
      </div>
      <div>
        <p className={styles.profileInformation}>
          {firstName} {lastName}
          <br />
          <i>{position}</i> <br />
          <a href={mailTo}>{email}</a> <br />
        </p>
      </div>
    </div>
  );
};

export default PhotoGangBangerPublic;
