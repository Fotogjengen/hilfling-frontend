import { api } from "./api";
import {MotiveDto, PhotoGangBangerDto} from "../../../generated";
import { PaginatedResult } from "./types";

export const MotiveApi = {
  getAll: async function (): Promise<PaginatedResult<MotiveDto>> {
    return api.get("/motives");
  },
};

export const PhotoGangBangerApi = {
  getAllActive: async function (): Promise<PaginatedResult<PhotoGangBangerDto>> {
    return api.get("/photo_gang_bangers/active");
  }
}