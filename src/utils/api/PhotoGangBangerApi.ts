import { api } from "./api";
import { PhotoGangBangerDto } from "../../../generated";
import { PaginatedResultData } from "./types";

export type PhotoGangBangerCreateRequest = Omit<
  PhotoGangBangerDto,
  "photoGangBangerId"
>;

export const PhotoGangBangerApi = {
  getAll: async function (): Promise<PaginatedResultData<PhotoGangBangerDto>> {
    const res = await api.get<PaginatedResultData<PhotoGangBangerDto>>(
      "/photo_gang_bangers",
    );
    return res.data;
  },

  getById: async function (id: string): Promise<PhotoGangBangerDto> {
    return api.get(`/photo_gang_bangers/${id}`).then((res) => res.data);
  },
  getAllActivesPublic: async function (): Promise<PhotoGangBangerDto[]> {
    return api
      .get("/photo_gang_bangers/actives")
      .then((res) => res.data.currentList);
  },

  getAllActivePangsPublic: async function (): Promise<PhotoGangBangerDto[]> {
    return api
      .get("/photo_gang_bangers/active_pangs")
      .then((res) => res.data.currentList);
  },

  getAllInactivePangsPublic: async function (): Promise<PhotoGangBangerDto[]> {
    return api
      .get("/photo_gang_bangers/inactive_pangs")
      .then((res) => res.data.currentList);
  },
  patch: async function (
    photoGangBanger: PhotoGangBangerDto,
  ): Promise<PhotoGangBangerDto> {
    return api
      .patch<PhotoGangBangerDto>("/photo_gang_bangers", photoGangBanger)
      .then((res) => res.data);
  },
  post: async function (user: PhotoGangBangerCreateRequest): Promise<number> {
    return api
      .post<number>("/photo_gang_bangers", user)
      .then((res) => res.data);
  },
};
