import {
  FilterSuggestionDto,
  FilterSuggestionsResponseDto,
} from "../../../generated";
import { AppliedFilter, DateFilter, DATE_FILTER_TYPE } from "../../types";
import { api } from "./api";

export const SearchSuggestionsApi = {
  get: async function (
    q: string,
    filters?: AppliedFilter[],
  ): Promise<FilterSuggestionsResponseDto> {
    const idsByType = (type: FilterSuggestionDto.type) =>
      filters?.filter((f) => f.type === type).map((f) => f.id);

    const dateFilter = filters?.find(
      (f): f is DateFilter => f.type === DATE_FILTER_TYPE,
    );

    return api
      .get("/search/suggestions", {
        params: {
          q,
          placeIds: idsByType(FilterSuggestionDto.type.PLACE),
          categoryIds: idsByType(FilterSuggestionDto.type.CATEGORY),
          eventOwnerIds: idsByType(FilterSuggestionDto.type.EVENT_OWNER),
          albumIds: idsByType(FilterSuggestionDto.type.ALBUM),
          securityLevels: idsByType(FilterSuggestionDto.type.SECURITY_LEVEL),
          from: dateFilter?.from,
          to: dateFilter?.to,
        },
        paramsSerializer: { indexes: null },
      })
      .then((res) => res.data);
  },
};
