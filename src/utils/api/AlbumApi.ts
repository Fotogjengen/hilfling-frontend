import { api } from "./api";
import { AlbumDto } from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";



export const AlbumApi = {
  getAll: async function (): Promise<PaginatedResult<AlbumDto>> {
    return api.get("/albums");
  },
  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/albums/${id}`);
  },
  post: async function (album: any): Promise<number> {
    return api
      .post("/albums", album)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
