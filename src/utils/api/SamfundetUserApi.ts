import { api } from "./api";
import { SamfundetUser, SamfundetUserDto } from "../../../generated";
import { PaginatedResult } from "./types";

export const SamfundetUserApi = {
  getAll: async function (): Promise<PaginatedResult<SamfundetUser>> {
    return api.get("/users");
  },

  getById: async function (id: string): Promise<SamfundetUserDto> {
    return api.get(`/users/${id}`).then(res => res.data);
  },

  post: async function (user: SamfundetUserDto): Promise<SamfundetUserDto> {
    return api
      .post("/users", user)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
  patch: async function (user: SamfundetUserDto): Promise<SamfundetUserDto> {
    return api
      .patch(`/users`, user)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
