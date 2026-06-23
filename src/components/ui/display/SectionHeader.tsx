import { Link, LinkProps } from "@tanstack/react-router";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  title: string;
  linkTo?: LinkProps["to"];
  linkLabel?: string;
};

export default function SectionHeader({
  title,
  linkTo,
  linkLabel = "Se alle",
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {linkTo && (
        <Link to={linkTo} className={styles.link}>
          {linkLabel} &rsaquo;
        </Link>
      )}
    </div>
  );
}
