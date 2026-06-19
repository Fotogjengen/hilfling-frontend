import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { format, parseISO } from "date-fns";
import SearchField from "../components/Search/SearchField";
import { useAdBanner } from "../hooks/useAdBanner";
import ImagesAdvertisementPopup from "../components/ImagesAdvertisementPopup/ImagesAdvertisementPopup";
import { FilterSuggestionDto } from "../../generated";
import {
  AppliedFilter,
  DateFilter,
  DateRange,
  DATE_FILTER_TYPE,
  SearchMode,
  SearchSort,
  SearchSortField,
} from "../types";
import { formatDateRange } from "../utils/formatDateRange";
import styles from "./search.module.css";
import AddFilterButton from "@/components/Search/AddFilterButton";
import SearchModeToggle from "@/components/Search/SearchModeToggle";
import SearchSortSelect from "@/components/Search/SearchSortSelect";
import SearchResults from "@/components/Search/SearchResults";

type ImageSearchQuery = {
  q?: string;
  filters?: AppliedFilter[];
  mode?: SearchMode;
  sort?: SearchSort;
};

const isSearchMode = (m: unknown): m is SearchMode =>
  m === "images" || m === "events";

const sortFields = new Set<string>([
  "DATE_TAKEN",
  "DATE_UPLOADED",
  "MOTIVE_TITLE",
  "CATEGORY",
  "PLACE",
] satisfies SearchSortField[]);

const isSort = (s: unknown): s is SearchSort => {
  if (typeof s !== "object" || s === null) return false;
  const { sortField, sortDirection } = s as SearchSort;
  return (
    sortFields.has(sortField as string) &&
    (sortDirection === "ASC" || sortDirection === "DESC")
  );
};

const filterTypes = new Set<string>([
  ...Object.values(FilterSuggestionDto.type).filter(
    (t) => t !== FilterSuggestionDto.type.MOTIVE,
  ),
  DATE_FILTER_TYPE,
]);

const isAppliedFilter = (f: unknown): f is AppliedFilter =>
  typeof f === "object" &&
  f !== null &&
  typeof (f as AppliedFilter).id === "string" &&
  typeof (f as AppliedFilter).displayText === "string" &&
  filterTypes.has((f as { type: unknown }).type as string);

export const Route = createFileRoute("/search")({
  component: RouteComponent,
  validateSearch: (search?: Record<string, unknown>): ImageSearchQuery => {
    const raw = search?.filters;
    const filters = Array.isArray(raw)
      ? raw.filter(isAppliedFilter)
      : undefined;
    return {
      q: typeof search?.q === "string" ? search.q : undefined,
      filters: filters?.length ? filters : undefined,
      mode: isSearchMode(search?.mode) ? search.mode : undefined,
      sort: isSort(search?.sort) ? search.sort : undefined,
    };
  },
});

function RouteComponent() {
  const { q, filters, mode = "images", sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });

  // get the date filter
  const dateFilter = filters?.find(
    (f): f is DateFilter => f.type === DATE_FILTER_TYPE,
  );
  const dateRange: DateRange = {
    from: dateFilter?.from ? parseISO(dateFilter.from) : undefined,
    to: dateFilter?.to ? parseISO(dateFilter.to) : undefined,
  };

  const setDateRange = useCallback(
    (range: DateRange) => {
      const next: AppliedFilter | null =
        range.from || range.to
          ? {
              type: DATE_FILTER_TYPE,
              id: DATE_FILTER_TYPE,
              displayText: formatDateRange(range) ?? "",
              from: range.from ? format(range.from, "yyyy-MM-dd") : undefined,
              to: range.to ? format(range.to, "yyyy-MM-dd") : undefined,
            }
          : null;
      void navigate({
        search: (prev) => {
          const existing = prev.filters ?? [];
          let updated: AppliedFilter[];
          if (!next) {
            updated = existing.filter((f) => f.type !== DATE_FILTER_TYPE);
          } else if (existing.some((f) => f.type === DATE_FILTER_TYPE)) {
            // Replace in place so the searchFilter chip keeps its position when edited.
            updated = existing.map((f) =>
              f.type === DATE_FILTER_TYPE ? next : f,
            );
          } else {
            updated = [...existing, next];
          }
          return { ...prev, filters: updated.length ? updated : undefined };
        },
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const addFilter = useCallback(
    (filter: AppliedFilter) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          filters: [
            ...(prev.filters ?? []).filter((f) => f.id !== filter.id),
            filter,
          ],
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const removeFilter = useCallback(
    (filter: AppliedFilter) => {
      void navigate({
        search: (prev) => {
          const remaining = (prev.filters ?? []).filter(
            (f) => f.id !== filter.id,
          );
          return {
            ...prev,
            filters: remaining.length ? remaining : undefined,
          };
        },
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const setQuery = useCallback(
    (query: string) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          q: query || undefined,
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const setMode = useCallback(
    (next: SearchMode) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          mode: next === "images" ? undefined : next,
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const setSort = useCallback(
    (next: SearchSort) => {
      // The backend default is DATE_TAKEN/DESC, so keep it out of the URL.
      const isDefault =
        next.sortField === "DATE_TAKEN" && next.sortDirection === "DESC";
      void navigate({
        search: (prev) => ({
          ...prev,
          sort: isDefault ? undefined : next,
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const { showAdBanner, dismissAdBanner } = useAdBanner();

  return (
    <div>
      <div className={styles.searchWrapper}>
        <SearchField
          initialValue={q}
          filters={filters}
          onFilterSelect={addFilter}
          onFilterRemove={removeFilter}
          onQueryChange={setQuery}
        />
        <div className={styles.filterRow}>
          <AddFilterButton
            filters={filters}
            dateRange={dateRange}
            onFilterSelect={addFilter}
            onFilterRemove={removeFilter}
            onDateRangeChange={setDateRange}
          />
          <SearchSortSelect sort={sort} onSortChange={setSort} />
        </div>
      </div>
      <div className={styles.results}>
        <SearchModeToggle mode={mode} onModeChange={setMode} />
        <SearchResults q={q} filters={filters} sort={sort} searchMode={mode} />
      </div>
      {showAdBanner && <ImagesAdvertisementPopup onClose={dismissAdBanner} />}
    </div>
  );
}
