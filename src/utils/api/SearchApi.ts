import { FilterSuggestionDto, MotiveDto } from "../../../generated";
import {
  AppliedFilter,
  DateFilter,
  DATE_FILTER_TYPE,
  SearchSort,
} from "../../types";
import { api } from "./api";
import { PaginatedResultData } from "./types";

/** The filter query params shared by the motive and picture search endpoints. */
const buildFilterParams = (filters?: AppliedFilter[]) => {
  const idsByType = (type: FilterSuggestionDto.type) =>
    filters?.filter((f) => f.type === type).map((f) => f.id);

  const dateFilter = filters?.find(
    (f): f is DateFilter => f.type === DATE_FILTER_TYPE,
  );

  return {
    placeIds: idsByType(FilterSuggestionDto.type.PLACE),
    categoryIds: idsByType(FilterSuggestionDto.type.CATEGORY),
    eventOwnerIds: idsByType(FilterSuggestionDto.type.EVENT_OWNER),
    albumIds: idsByType(FilterSuggestionDto.type.ALBUM),
    securityLevels: idsByType(FilterSuggestionDto.type.SECURITY_LEVEL),
    from: dateFilter?.from,
    to: dateFilter?.to,
  };
};

type SearchParams = {
  q?: string;
  filters?: AppliedFilter[];
  sort?: SearchSort;
  page: number;
};

const search = <T>(path: string, { q, filters, sort, page }: SearchParams) =>
  api
    .get<PaginatedResultData<T>>(path, {
      params: {
        q,
        ...buildFilterParams(filters),
        sortField: sort?.sortField,
        sortDirection: sort?.sortDirection,
        page,
      },
      paramsSerializer: { indexes: null },
    })
    .then((res) => res.data);

export const SearchApi = {
  searchMotives: (params: SearchParams) =>
    search<MotiveDto>("/search/motives", params),
};
