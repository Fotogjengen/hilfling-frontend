import { api } from "./api";
import { MotiveDto, PhotoGangBangerDto } from "../../../generated";
import { PaginatedResult } from "./types";

export const MotiveApi = {
  getAll: async function (): Promise<PaginatedResult<MotiveDto>> {
    return api.get("/motives");
  },
  getById: async function (id: string): Promise<MotiveDto> {
    return api
      .get(`/motives/${id}`)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
  patch: async function (motive: MotiveDto): Promise<MotiveDto> {
    return api
      .patch(`/motives`, motive)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
  deleteById: async function (id: string): Promise<Number> {
    return api
      .delete(`/motives/${id}`)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};

export const PhotoGangBangerApi = {
  getAllActive: async function (): Promise<
    PaginatedResult<PhotoGangBangerDto>
  > {
    return api.get("/photo_gang_bangers/active");
  },
};
