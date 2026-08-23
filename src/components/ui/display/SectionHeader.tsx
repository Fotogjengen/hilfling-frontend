import { Link, LinkProps } from "@tanstack/react-router";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  title: string;
  link?: LinkProps;
  linkLabel?: string;
};

export default function SectionHeader({
  title,
  link,
  linkLabel = "Se alle",
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {link && (
        <Link {...link} className={styles.link}>
          {linkLabel} &rsaquo;
        </Link>
      )}
    </div>
  );
}
