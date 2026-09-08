import { api } from "./api";
import { PhotoGangBangerDto } from "../../../generated";
import { PaginatedResultData } from "./types";

export type PhotoGangBangerCreateRequest = Omit<
  PhotoGangBangerDto,
  "photoGangBangerId"
>;

export const PhotoGangBangerApi = {
  getMe: async function (): Promise<PhotoGangBangerDto> {
    return api
      .get<PhotoGangBangerDto>("/photo_gang_bangers/me")
      .then((res) => res.data);
  },

  uploadProfilePicture: async function (
    media: File,
  ): Promise<PhotoGangBangerDto> {
    const formData = new FormData();
    formData.append("media", media);
    return api
      .post<PhotoGangBangerDto>(
        "/photo_gang_bangers/me/profile-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      )
      .then((res) => res.data);
  },

  deleteProfilePicture: async function (): Promise<PhotoGangBangerDto> {
    return api
      .delete<PhotoGangBangerDto>("/photo_gang_bangers/me/profile-picture")
      .then((res) => res.data);
  },

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
