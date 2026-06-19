import { ComponentType, ReactNode } from "react";
import styles from "./SearchFilter.module.css";
import { LucideProps, Plus, X } from "lucide-react";

type SearchFilterProps = {
  icon?: ComponentType<LucideProps>;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

export default function SearchFilter({
  icon: Icon,
  selected,
  onClick,
  children,
}: SearchFilterProps) {
  return (
    <div className={styles.searchFilter} onClick={onClick}>
      {Icon && <Icon className={styles.icon} size={16} />}
      {children}
      {selected ? <X size={14} /> : <Plus size={14} />}
    </div>
  );
}
