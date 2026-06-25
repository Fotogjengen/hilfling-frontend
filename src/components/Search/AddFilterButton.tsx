import {
  Plus,
  MapPin,
  Tag,
  Calendar,
  Book,
  Lock,
  LucideIcon,
} from "lucide-react";
import { Button } from "../ui/input/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/overlay/DropdownMenu";

import styles from "./AddFilterButton.module.css";
import { ReactNode, useState } from "react";
import { SearchField } from "../ui/input/SearchField";
import { DatePicker } from "../ui/input/DatePicker";
import { usePlaces } from "@/hooks/place";
import { useCategories } from "@/hooks/category";
import { useAlbums } from "@/hooks/album";
import { Spinner } from "../Icons/Spinner";
import { Checkbox } from "../ui/input/Checkbox";
import {
  AppliedFilter,
  DateRange,
  SecurityLevelType,
  ValueFilterType,
} from "../../types";
import { FilterSuggestionDto } from "../../../generated";
import { useAuth } from "../../contexts/AuthenticationContext";
import { formatDateRange } from "../../utils/formatDateRange";

type SubmenuProps = {
  filters?: AppliedFilter[];
  onFilterSelect?: (filter: AppliedFilter) => void;
  onFilterRemove?: (filter: AppliedFilter) => void;
};

export default function AddFilterButton({
  filters,
  onFilterSelect,
  onFilterRemove,
  dateRange,
  onDateRangeChange,
}: SubmenuProps & {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}) {
  const { isAuthenticated, jwtPayload } = useAuth();
  const securityLevel = jwtPayload?.securityLevel;
  const isPrivileged =
    isAuthenticated && (securityLevel === "HUSFOLK" || securityLevel === "FG");

  const submenuProps = { filters, onFilterSelect, onFilterRemove };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="neutral" className={styles.addFilterButton}>
          <Plus size={18} />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={styles.filterMenu}>
        <div className={`${styles.subMenuHeader} ${styles.filterMenuHeader}`}>
          <div className={styles.submenuNameText}>Filter</div>
          <button
            type="button"
            className={styles.resetText}
            onClick={() => filters?.forEach((f) => onFilterRemove?.(f))}
          >
            Tilbakestill alle
          </button>
        </div>
        <PlaceSubmenu {...submenuProps} />
        <CategorySubmenu {...submenuProps} />
        <DateSubmenu
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
        {isPrivileged && (
          <>
            <DropdownMenuSeparator />
            <AlbumSubmenu {...submenuProps} />
            <SecurityLevelSubmenu
              securityLevel={securityLevel}
              {...submenuProps}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmenuTrigger({
  icon: Icon,
  name,
  summary,
}: {
  icon: LucideIcon;
  name: string;
  summary?: string;
}) {
  return (
    <DropdownMenuSubTrigger>
      <div className={styles.triggerContent}>
        <Icon size={20} className={styles.triggerIcon} />
        <div className={styles.triggerText}>
          <span className={styles.triggerName}>{name}</span>
          {summary && <span className={styles.triggerSummary}>{summary}</span>}
        </div>
      </div>
    </DropdownMenuSubTrigger>
  );
}

function SubmenuWrapper({
  name,
  searchValue,
  onSearchChange,
  onReset,
  children,
}: {
  name: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onReset?: () => void;
  children: ReactNode;
}) {
  return (
    <div className={styles.submenuWrapper}>
      <div className={styles.subMenuHeader}>
        <div className={styles.submenuNameText}>{name}</div>
        <button type="button" className={styles.resetText} onClick={onReset}>
          Tilbakestill
        </button>
      </div>
      {onSearchChange && (
        <SearchField
          placeholder="Søk"
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange("")}
        />
      )}
      {children}
    </div>
  );
}

type FilterItem = { id: string; name: string };

function FilterSubmenu({
  name,
  icon,
  type,
  items,
  isLoading,
  searchable = true,
  filters,
  onFilterSelect,
  onFilterRemove,
}: SubmenuProps & {
  name: string;
  icon: LucideIcon;
  type: ValueFilterType;
  items: FilterItem[] | undefined;
  isLoading: boolean;
  searchable?: boolean;
}) {
  const [search, setSearch] = useState("");

  const activeFilters = filters?.filter((f) => f.type === type);
  const selectedIds = new Set(activeFilters?.map((f) => f.id));
  const summary = activeFilters?.map((f) => f.displayText).join(", ");

  const toggle = (item: FilterItem) => {
    const filter: AppliedFilter = {
      type,
      id: item.id,
      displayText: item.name,
    };
    if (selectedIds.has(item.id)) {
      onFilterRemove?.(filter);
    } else {
      onFilterSelect?.(filter);
    }
  };

  const filtered = searchable
    ? items?.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  return (
    <DropdownMenuSub>
      <SubmenuTrigger icon={icon} name={name} summary={summary} />
      <DropdownMenuSubContent>
        <SubmenuWrapper
          name={name}
          searchValue={searchable ? search : undefined}
          onSearchChange={searchable ? setSearch : undefined}
          onReset={() => {
            setSearch("");
            activeFilters?.forEach((f) => onFilterRemove?.(f));
          }}
        >
          {isLoading || !filtered ? (
            <Spinner />
          ) : (
            <div className={styles.placeList}>
              {filtered.map((item) => (
                <Checkbox
                  key={item.id}
                  label={item.name}
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={() => toggle(item)}
                />
              ))}
            </div>
          )}
        </SubmenuWrapper>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

function PlaceSubmenu(props: SubmenuProps) {
  const { data, isPending, isError } = usePlaces();
  return (
    <FilterSubmenu
      name="Sted"
      icon={MapPin}
      type={FilterSuggestionDto.type.PLACE}
      items={data?.map((p) => ({ id: p.placeId.id, name: p.name }))}
      isLoading={isPending || isError}
      {...props}
    />
  );
}

function CategorySubmenu(props: SubmenuProps) {
  const { data, isPending, isError } = useCategories();
  return (
    <FilterSubmenu
      name="Kategori"
      icon={Tag}
      type={FilterSuggestionDto.type.CATEGORY}
      items={data?.map((c) => ({ id: c.categoryId.id, name: c.name }))}
      isLoading={isPending || isError}
      {...props}
    />
  );
}

function AlbumSubmenu(props: SubmenuProps) {
  const { data, isPending, isError } = useAlbums();
  return (
    <FilterSubmenu
      name="Album"
      icon={Book}
      type={FilterSuggestionDto.type.ALBUM}
      items={data?.map((a) => ({ id: a.albumId.id, name: a.name }))}
      isLoading={isPending || isError}
      {...props}
    />
  );
}

const securityLevelLabel: Record<SecurityLevelType, string> = {
  FG: "FG",
  HUSFOLK: "Husfolk",
  ALLE: "Alle",
};

/** Security levels ordered from highest access to lowest. */
const securityLevelsDescending: SecurityLevelType[] = ["FG", "HUSFOLK", "ALLE"];

function SecurityLevelSubmenu({
  securityLevel,
  ...props
}: SubmenuProps & { securityLevel?: SecurityLevelType }) {
  if (!securityLevel) return null;
  const fromCurrentAndDown = securityLevelsDescending.slice(
    securityLevelsDescending.indexOf(securityLevel),
  );
  return (
    <FilterSubmenu
      name="Sikkerhetsnivå"
      icon={Lock}
      type={FilterSuggestionDto.type.SECURITY_LEVEL}
      items={fromCurrentAndDown.map((level) => ({
        id: level,
        name: securityLevelLabel[level],
      }))}
      isLoading={false}
      searchable={false}
      {...props}
    />
  );
}

function DateSubmenu({
  dateRange,
  onDateRangeChange,
}: {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}) {
  const { from, to } = dateRange ?? {};

  return (
    <DropdownMenuSub>
      <SubmenuTrigger
        icon={Calendar}
        name="Dato"
        summary={formatDateRange(dateRange)}
      />
      <DropdownMenuSubContent>
        <SubmenuWrapper name="Dato" onReset={() => onDateRangeChange?.({})}>
          <div className={styles.dateFields}>
            <DatePicker
              label="Fra"
              value={from}
              disabledDates={to ? { after: to } : undefined}
              onChange={(d) => onDateRangeChange?.({ from: d, to })}
            />
            <DatePicker
              label="Til"
              value={to}
              disabledDates={from ? { before: from } : undefined}
              onChange={(d) => onDateRangeChange?.({ from, to: d })}
            />
          </div>
        </SubmenuWrapper>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
