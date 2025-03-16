import React, { FC } from "react";
import styles from "./PhotoGangBangerPublic.module.css";
import { GuiProfileImage } from "../../gui-components";

interface Props {
  image: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
}

const PhotoGangBangerPublic: FC<Props> = ({
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
        <GuiProfileImage alt={firstName} src={image} onClick={onClick} />
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
