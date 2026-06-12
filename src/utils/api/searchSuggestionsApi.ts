import { FilterSuggestionDto } from "../../../generated";
import { api } from "./api";

export const SearchSuggestionsApi = {
  get: async function (q: string): Promise<FilterSuggestionDto[]> {
    return api
      .get("/search/suggestions", {
        params: {
          q,
        },
      })
      .then((res) => res.data);
  },
};
