import styles from "./PhotoGangBangerPublic.module.css";
import { ProfileImage } from "@/components/ui/display/ProfileImage";

interface Props {
  image: string;
  name: string;
  position: string;
  email: string;
}

const PhotoGangBangerPublic = ({ name, position, image, email }: Props) => {
  const onClick = (): void => {
    alert("Hei");
  };

  const mailTo = "mailto:" + email;
  return (
    <div className={styles.profile}>
      <div className={styles.profileImage}>
        <ProfileImage alt={name} src={image} onClick={onClick} />
      </div>
      <div>
        <p className={styles.profileInformation}>
          {name}
          <br />
          <i>{position}</i> <br />
          <a href={mailTo}>{email}</a> <br />
        </p>
      </div>
    </div>
  );
};

export default PhotoGangBangerPublic;
