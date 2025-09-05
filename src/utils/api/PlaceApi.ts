import { api } from "./api";
import { PlaceDto } from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export const PlaceApi = {
  getAll: async function (
    params?: PaginationParams,
  ): Promise<PaginatedResult<PlaceDto>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined)
      searchParams.set("page", params.page.toString());
    if (params?.pageSize !== undefined)
      searchParams.set("pageSize", params.pageSize.toString());

    return api.get(
      `/places${searchParams.toString() ? `?${searchParams}` : ""}`,
    );
  },

  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/places/${id}`);
  },
  // eslint-disable-next-line
  post: async function (place: any): Promise<number> {
    return api
      .post("/places", place)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
