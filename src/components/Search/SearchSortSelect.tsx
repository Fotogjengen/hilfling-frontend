import { Select } from "../ui/input/Select";
import { SearchSort, SearchSortField, SortDirection } from "../../types";
import styles from "./SearchSortSelect.module.css";

type SortOption = {
  value: string;
  label: string;
  sortField: SearchSortField;
  sortDirection: SortDirection;
};

/**
 * relevance is special. Should only be selectable whenver we have a query
 */
const relevanceOption: SortOption = {
  value: "RELEVANCE:DESC",
  label: "Mest relevant",
  sortField: "RELEVANCE",
  sortDirection: "DESC",
};

/**
 * sort options visible in the dropdown
 */
const sortOptions: SortOption[] = [
  {
    value: "DATE_TAKEN:DESC",
    label: "Nyeste først",
    sortField: "DATE_TAKEN",
    sortDirection: "DESC",
  },
  {
    value: "DATE_TAKEN:ASC",
    label: "Eldste først",
    sortField: "DATE_TAKEN",
    sortDirection: "ASC",
  },
  {
    value: "DATE_UPLOADED:DESC",
    label: "Sist opplastet",
    sortField: "DATE_UPLOADED",
    sortDirection: "DESC",
  },
  {
    value: "DATE_UPLOADED:ASC",
    label: "Først opplastet",
    sortField: "DATE_UPLOADED",
    sortDirection: "ASC",
  },
  {
    value: "MOTIVE_TITLE:ASC",
    label: "Tittel (A–Å)",
    sortField: "MOTIVE_TITLE",
    sortDirection: "ASC",
  },
  {
    value: "MOTIVE_TITLE:DESC",
    label: "Tittel (Å–A)",
    sortField: "MOTIVE_TITLE",
    sortDirection: "DESC",
  },
  {
    value: "CATEGORY:ASC",
    label: "Kategori (A–Å)",
    sortField: "CATEGORY",
    sortDirection: "ASC",
  },
  {
    value: "CATEGORY:DESC",
    label: "Kategori (Å–A)",
    sortField: "CATEGORY",
    sortDirection: "DESC",
  },
  {
    value: "PLACE:ASC",
    label: "Sted (A–Å)",
    sortField: "PLACE",
    sortDirection: "ASC",
  },
  {
    value: "PLACE:DESC",
    label: "Sted (Å–A)",
    sortField: "PLACE",
    sortDirection: "DESC",
  },
];

type SearchSortSelectProps = {
  sort?: SearchSort;
  hasQuery: boolean;
  onSortChange: (sort: SearchSort) => void;
};

export default function SearchSortSelect({
  sort,
  hasQuery,
  onSortChange,
}: SearchSortSelectProps) {
  const options = hasQuery ? [relevanceOption, ...sortOptions] : sortOptions;
  // relevance should be the default only while searching to match backend
  const defaultOption = hasQuery ? relevanceOption : sortOptions[0];

  const current =
    options.find(
      (o) =>
        o.sortField === sort?.sortField &&
        o.sortDirection === sort?.sortDirection,
    ) ?? defaultOption;

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Sorter</span>
      <Select
        className={styles.select}
        options={options}
        value={current.value}
        onValueChange={(value) => {
          const option =
            options.find((o) => o.value === value) ?? defaultOption;
          onSortChange({
            sortField: option.sortField,
            sortDirection: option.sortDirection,
          });
        }}
      />
    </div>
  );
}
