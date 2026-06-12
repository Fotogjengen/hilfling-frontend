import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import SearchField from "../components/SearchComponent/SearchField";
import { useAdBanner } from "../hooks/useAdBanner";
import ImagesAdvertisementPopup from "../components/ImagesAdvertisementPopup/ImagesAdvertisementPopup";
import { FilterSuggestionDto } from "../../generated";

type ImageSearchQuery = {
  q?: string;
  filters?: FilterSuggestionDto[];
};

export const Route = createFileRoute("/search")({
  component: RouteComponent,
  validateSearch: (search?: Record<string, unknown>): ImageSearchQuery => {
    const raw = search?.filters;
    const filters = Array.isArray(raw)
      ? raw.filter(
          (f): f is FilterSuggestionDto =>
            typeof f === "object" &&
            f !== null &&
            typeof (f as FilterSuggestionDto).id === "string" &&
            typeof (f as FilterSuggestionDto).type === "string" &&
            typeof (f as FilterSuggestionDto).displayText === "string",
        )
      : undefined;
    return {
      q: typeof search?.q === "string" ? search.q : undefined,
      filters: filters?.length ? filters : undefined,
    };
  },
});

function RouteComponent() {
  const { q, filters } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });

  const addFilter = useCallback(
    (filter: FilterSuggestionDto) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          filters: [
            ...(prev.filters ?? []).filter((f) => f.id !== filter.id),
            filter,
          ],
        }),
        replace: true,
      });
    },
    [navigate],
  );

  const removeFilter = useCallback(
    (filter: FilterSuggestionDto) => {
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
      });
    },
    [navigate],
  );

  const { showAdBanner, dismissAdBanner } = useAdBanner();

  return (
    <div>
      <SearchField
        initialValue={q}
        filters={filters}
        onFilterSelect={addFilter}
        onFilterRemove={removeFilter}
        onQueryChange={setQuery}
      />
      {showAdBanner && <ImagesAdvertisementPopup onClose={dismissAdBanner} />}
    </div>
  );
}
