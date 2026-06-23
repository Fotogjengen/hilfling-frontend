import { api } from "./api";
import {
  MotiveCreateRequestDto,
  MotiveDto,
  MotivePatchRequestDto,
  PhotoGangBangerDto,
} from "../../../generated";
import { PaginatedResult } from "./types";

export const MotiveApi = {
  getAll: async function (): Promise<PaginatedResult<MotiveDto>> {
    return api.get("/motives");
  },
  getPage: async function (page: number): Promise<PaginatedResult<MotiveDto>> {
    return api.get("/motives", { params: { page } });
  },
  search: async function (
    searchTerm: string,
    page: number,
  ): Promise<PaginatedResult<MotiveDto>> {
    return api.get(`/motives/search/${encodeURIComponent(searchTerm)}`, {
      params: { page },
    });
  },
  getById: async function (id: string): Promise<MotiveDto> {
    return api.get(`/motives/${id}`).then((res) => res.data);
  },
  patch: async function (motive: MotivePatchRequestDto): Promise<MotiveDto> {
    return api.patch(`/motives`, motive).then((res) => res.data);
  },
  create: async function (motive: MotiveCreateRequestDto): Promise<MotiveDto> {
    return api.post(`/motives`, motive).then((res) => res.data);
  },
  delete: async function (id: string): Promise<void> {
    return api.delete(`/motives/${id}`);
  },
  getDefaults: async function (): Promise<Partial<MotiveDto>> {
    return api.get("/motives/defaults").then((res) => res.data);
  },
};

export const PhotoGangBangerApi = {
  getAllActive: async function (): Promise<
    PaginatedResult<PhotoGangBangerDto>
  > {
    return api.get("/photo_gang_bangers/active");
  },
};
