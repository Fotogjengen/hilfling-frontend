import { api } from "./api";

export const SearchSuggestionsApi = {
  get: async function (term: string): Promise<string[]> {
    return api
      .get("/searchSuggestions", {
        params: {
          term,
        },
      })
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
