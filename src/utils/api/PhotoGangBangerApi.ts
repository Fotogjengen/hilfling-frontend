import { api } from "./api";
import {
  PhotoGangBangerDto,
  PhotoGangBangerPatchRequestDto,
  PhotoGangBangerPositionsPutRequestDto,
} from "../../../generated";
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
  getCurrent: async function (): Promise<PhotoGangBangerDto> {
    return api.get("/photo_gang_bangers/me").then((res) => res.data);
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
    photoGangBanger: PhotoGangBangerPatchRequestDto,
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
  putPositions: async function (
    request: PhotoGangBangerPositionsPutRequestDto,
  ): Promise<PhotoGangBangerDto> {
    return api
      .put<PhotoGangBangerDto>("/photo_gang_bangers/positions", request)
      .then((res) => res.data);
  },
};
