import { ReactNode } from "react";
import { MotiveDto } from "../../../generated";
import styles from "./MotiveCard.module.css";

interface Props {
  motive: MotiveDto;
  children?: ReactNode;
}

function MotiveCard({ motive, children }: Props) {
  return (
    <div className={styles.container}>
      <div>
        <p className={styles.category}>{motive?.categoryDto?.name}</p>
        <p className={styles.title}>{motive?.title}</p>
        <p className={styles.meta}>Eier: {motive?.eventOwnerDto?.name}</p>
        <p className={styles.meta}>Album: {motive?.albumDto?.name}</p>
        <p className={styles.meta}>
          Dato:{" "}
          {motive?.dateCreated
            ? new Date(motive.dateCreated).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
      {children}
    </div>
  );
}

export default MotiveCard;
