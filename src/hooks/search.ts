import { SearchSuggestionsApi } from "@/utils/api/searchSuggestionsApi";
import { useQuery } from "@tanstack/react-query";

export const useSearchSuggestions = (q: string) => {
  return useQuery({
    queryKey: ["search", "suggestions", q],
    queryFn: () => SearchSuggestionsApi.get(q),
  });
};
