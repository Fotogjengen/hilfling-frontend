import { api } from "./api";
import {
  ExternalUserDto,
  ExternalUserPasswordResetRequestDto,
  ExternalUserPatchRequestDto,
} from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";

export type ExternalUserCreateRequest = Omit<ExternalUserDto, "externalUserId">;

export const ExternalUserApi = {
  getAll: async function (): Promise<PaginatedResult<ExternalUserDto>> {
    return api.get("/external-users");
  },

  post: async function (user: ExternalUserCreateRequest): Promise<number> {
    return api.post("/external-users", user).then((res) => res.data);
  },

  patch: async function (
    user: ExternalUserPatchRequestDto,
  ): Promise<ExternalUserDto> {
    return api.patch("/external-users", user).then((res) => res.data);
  },

  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/external-users/${id}`);
  },

  resetPassword: async function (
    id: string,
    request: ExternalUserPasswordResetRequestDto,
  ): Promise<void> {
    return api.post(`/external-users/${id}/reset-password`, request);
  },
};
