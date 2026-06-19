import { useSearchMotives } from "@/hooks/search";
import { useDebounce } from "@/hooks/useDebounce";
import { AppliedFilter, SearchMode, SearchSort } from "@/types";
import EventResults, { EventResultsSkeleton } from "./EventResults";
import PhotosResults, { PhotosResultsSkeleton } from "./PhotosResults";
import styles from "./SearchResults.module.css";

type SearchResultsProps = {
  q?: string;
  filters?: AppliedFilter[];
  sort?: SearchSort;
  searchMode: SearchMode;
};

export default function SearchResults({
  q,
  filters,
  sort,
  searchMode,
}: SearchResultsProps) {
  const { value: debouncedQ, isDebouncing } = useDebounce(q);
  const { data, isPending, isError } = useSearchMotives(
    debouncedQ,
    filters,
    sort,
  );

  if (isPending || isDebouncing) {
    return searchMode === "events" ? (
      <EventResultsSkeleton />
    ) : (
      <PhotosResultsSkeleton />
    );
  }

  if (isError) {
    return (
      <p className={styles.message}>
        {searchMode === "events"
          ? "Kunne ikke hente arrangementer."
          : "Kunne ikke hente bilder."}
      </p>
    );
  }

  const motives = data.pages.flatMap((page) => page.currentList);

  if (motives.length === 0) {
    return (
      <p className={styles.message}>
        {searchMode === "events"
          ? "Ingen arrangementer funnet."
          : "Ingen bilder funnet."}
      </p>
    );
  }

  return searchMode === "events" ? (
    <EventResults motives={motives} />
  ) : (
    <PhotosResults motives={motives} />
  );
}
