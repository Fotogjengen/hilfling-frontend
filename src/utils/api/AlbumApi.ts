import { api } from "./api";
import { AlbumDto } from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export const AlbumApi = {
  getAll: async function (
    params?: PaginationParams,
  ): Promise<PaginatedResult<AlbumDto>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined)
      searchParams.set("page", params.page.toString());
    if (params?.pageSize !== undefined)
      searchParams.set("pageSize", params.pageSize.toString());

    return api.get(
      `/albums${searchParams.toString() ? `?${searchParams}` : ""}`,
    );
  },

  getById: async function (id: string): Promise<AlbumDto> {
    return api.get(`/albums/${id}`);
  },

  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/albums/${id}`);
  },
  // eslint-disable-next-line
  post: async function (album: any): Promise<number> {
    return api
      .post("/albums", album)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
