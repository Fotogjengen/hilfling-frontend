import { api } from "./api";
import { AlbumDto } from "../../../generated";
import { DeletedResult } from "./types";
import { AlbumPatchRequestDto } from "../../../generated";

export type AlbumCreateRequest = Omit<AlbumDto, "albumId">;

export const AlbumApi = {
  getAll: async function (): Promise<AlbumDto[]> {
    return api.get("/albums").then((res) => res.data);
  },

  getById: async function (id: string): Promise<AlbumDto> {
    return api.get(`/albums/${id}`);
  },

  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/albums/${id}`);
  },
  patch: async function (album: AlbumPatchRequestDto): Promise<AlbumDto> {
    return api.patch(`/albums`, album).then((res) => res.data);
  },

  post: async function (album: AlbumCreateRequest): Promise<number> {
    return api.post("/albums", album).then((res) => res.data);
  },

  setDefault: async function (albumId: string): Promise<AlbumDto> {
    return api.put(`albums/${albumId}/default`).then((res) => res.data);
  },
};
