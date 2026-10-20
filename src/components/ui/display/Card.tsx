import { ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = {
  children?: ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Card({ children, onClick, isActive, className }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        styles.cardWrapper,
        isActive ? styles.active : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
