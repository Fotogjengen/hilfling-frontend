import styles from "./CardInformationFotogjengen.module.css";
import { Link } from "@tanstack/react-router";

interface Props {
  title: string;
  description: string;
  link?: string;
}

const CardInformationFotogjengen = ({ title, description, link }: Props) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {link && (
        <p>
          <Link
            className={styles.link}
            to={link}
            onClick={() => window.scrollTo(0, 0)}
          >
            Les mer her.
          </Link>
        </p>
      )}
    </div>
  );
};

export default CardInformationFotogjengen;
