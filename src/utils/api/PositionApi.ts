import { api } from "./api";
import { PositionDto } from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";

export const PositionApi = {
  getAll: async function (): Promise<PaginatedResult<PositionDto>> {
    return api.get("/positions");
  },
  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/positions/${id}`);
  },

  post: async function (postion: any): Promise<number> {
    return api
      .post("/positions", postion)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
