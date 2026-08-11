import { SearchSuggestionsApi } from "@/utils/api/searchSuggestionsApi";
import { SearchApi } from "@/utils/api/SearchApi";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { AppliedFilter, SearchSort } from "../types";

export const useSearchSuggestions = (q: string, filters?: AppliedFilter[]) => {
  return useQuery({
    queryKey: ["search", "suggestions", q, filters],
    queryFn: () => SearchSuggestionsApi.get(q, filters),
    placeholderData: keepPreviousData,
  });
};

export const useSearchMotives = (
  q?: string,
  filters?: AppliedFilter[],
  sort?: SearchSort,
) => {
  return useInfiniteQuery({
    queryKey: ["search", "motives", q, filters, sort],
    queryFn: ({ pageParam }) =>
      SearchApi.searchMotives({ q, filters, sort, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
  });
};
