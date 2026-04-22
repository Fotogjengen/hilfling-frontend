import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import SearchField from "../components/SearchComponent/SearchField";
import { SearchContext } from "@/components/Search/SearchContext";
import SearchMotiveGrid from "@/components/Search/SearchMotiveGrid";
import { useAdBanner } from "../hooks/useAdBanner";
import ImagesAdvertisementPopup from "../components/ImagesAdvertisementPopup/ImagesAdvertisementPopup";

type ImageSearchQuery = {
  query?: string;
};

export const Route = createFileRoute("/search")({
  component: RouteComponent,
  validateSearch: (search?: Record<string, unknown>): ImageSearchQuery => {
    return {
      query: typeof search?.query === "string" ? search.query : undefined,
    };
  },
});

function RouteComponent() {
  const { query } = Route.useSearch();

  // update the url whenever the sarch query changes
  const navigate = useNavigate({ from: "/search" });
  const setSearchQuery = useCallback(
    (value: string) => {
      void navigate({
        search: (prev) => ({ ...prev, query: value || undefined }),
        replace: true,
      });
    },
    [navigate],
  );

  const searchContextValue = useMemo(
    () => ({ searchQuery: query ?? "", setSearchQuery }),
    [query, setSearchQuery],
  );

  const { showAdBanner, dismissAdBanner } = useAdBanner();

  return (
    <div>
      <SearchContext.Provider value={searchContextValue}>
        <SearchField initialValue={query} />
        <SearchMotiveGrid />
      </SearchContext.Provider>
      {showAdBanner && <ImagesAdvertisementPopup onClose={dismissAdBanner} />}
    </div>
  );
}
