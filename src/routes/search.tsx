import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import SearchField from "../components/SearchComponent/SearchField";
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
  const navigate = useNavigate({ from: "/search" });

  const setQuery = useCallback(
    (value: string) => {
      void navigate({
        search: (prev) => ({ ...prev, query: value || undefined }),
        replace: true,
      });
    },
    [navigate],
  );

  const { showAdBanner, dismissAdBanner } = useAdBanner();

  return (
    <div>
      <SearchField initialValue={query} onChange={setQuery} />
      <SearchMotiveGrid query={query ?? ""} />
      {showAdBanner && <ImagesAdvertisementPopup onClose={dismissAdBanner} />}
    </div>
  );
}
