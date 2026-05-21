import { api } from "./api";
import { PhotoGangBangerDto } from "../../../generated";
import { PaginatedResult, PaginatedResultData } from "./types";

export const PhotoGangBangerApi = {
  getAll: async function (): Promise<PaginatedResultData<PhotoGangBangerDto>> {
    const res = await api.get<PaginatedResult<PhotoGangBangerDto>>(
      "/photo_gang_bangers",
    );
    return res.data.data;
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
  ): Promise<PhotoGangBangerDto[]> {
    return api
      .patch("/photo_gang_bangers", photoGangBanger)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
  post: async function (user: PhotoGangBangerDto): Promise<PhotoGangBangerDto> {
    return api
      .post("/photo_gang_bangers", user)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
