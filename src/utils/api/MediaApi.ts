import { api } from "./api";
import { MediaDto, MediaPatchRequestDto } from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export const MediaApi = {
  getAll: async function (
    params?: PaginationParams,
  ): Promise<PaginatedResult<MediaDto>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined)
      searchParams.set("page", params.page.toString());
    if (params?.pageSize !== undefined)
      searchParams.set("pageSize", params.pageSize.toString());

    return api.get(
      `/medias${searchParams.toString() ? `?${searchParams}` : ""}`,
    );
  },

  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/medias/${id}`);
  },

  post: async function (media: Omit<MediaDto, "mediaId">): Promise<number> {
    return api.post("/medias", media).then((res) => res.data);
  },

  patch: async function (media: MediaPatchRequestDto): Promise<MediaDto> {
    return api.patch("/medias", media).then((res) => res.data);
  },
};
