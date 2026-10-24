import { api } from "./api";
import {
  Permission,
  PositionDto,
  PositionPatchRequestDto,
} from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";

export type PositionCreateRequest = Omit<PositionDto, "positionId">;

export const PositionApi = {
  getAll: async function (): Promise<PaginatedResult<PositionDto>> {
    return api.get("/positions");
  },
  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/positions/${id}`);
  },
  patch: async function (
    position: PositionPatchRequestDto,
  ): Promise<PositionDto> {
    return api.patch("/positions", position).then((res) => res.data);
  },
  post: async function (position: PositionCreateRequest): Promise<number> {
    return api.post("/positions", position).then((res) => res.data);
  },
  getPermissions: async function (id: string): Promise<Permission[]> {
    return api.get(`/positions/${id}/permissions`).then((res) => res.data);
  },
  putPermissions: async function (
    id: string,
    permissions: Permission[],
  ): Promise<Permission[]> {
    return api
      .put(`/positions/${id}/permissions`, permissions)
      .then((res) => res.data);
  },
};
