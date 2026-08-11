import { api } from "./api";
import {
  PhotoDto,
  PhotoGoodPictureToggleRequestDto,
  PhotoPositionDto,
} from "../../../generated";
import { PaginatedResult, PaginatedResultData } from "./types";
import { AxiosProgressEvent } from "axios";

export interface PhotoUploadRequest {
  motiveId: string;
  gangId?: string;
  date: string;
  goodPicture?: boolean;
  analog?: boolean;
  media: File;
  securityLevel: string;
}

export interface PhotoUploadResponse {
  ok: true;
  prod: string;
  web: string;
  thumb: string;
}

export interface PhotoSearch {
  motive?: string;
  place?: string;
  gang?: string;
  album?: string;
  category?: string;
  tag?: string[];
  isGoodPic?: boolean;
  analog?: boolean;
  fromDate?: string;
  toDate?: string;
  page?: string;
  pageSize?: string;
  securityLevel?: string;
  [key: string]: string | string[] | boolean | undefined;
}

export const PhotoApi = {
  getAll: async function (): Promise<PhotoDto[]> {
    return api.get("/photos").then((res) => res.data.currentList);
  },

  getPhotoCount: async function (): Promise<number> {
    return api
      .get("/photos/count")
      .then((res) => res.data.PromiseResult)
      .catch((e) => {
        console.log(e);
      });
  },

  getAllByMotiveId: async function (id: string): Promise<PhotoDto[]> {
    return api.get(`/photos/motive/${id}`).then((res) => res.data);
  },
  getAllGoodByMotiveId: async function (id: string): Promise<PhotoDto[]> {
    return api
      .get(`/photos/motive/${id}/good-pictures`)
      .then((res) => res.data);
  },
  upload: async function (
    request: PhotoUploadRequest,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  ): Promise<PhotoUploadResponse> {
    const formData = new FormData();
    formData.append("motive_id", request.motiveId);
    if (request.gangId) formData.append("gang_id", request.gangId);
    formData.append("date", request.date);
    if (request.goodPicture !== undefined)
      formData.append("good_picture", String(request.goodPicture));
    if (request.analog !== undefined)
      formData.append("analog", String(request.analog));
    formData.append("media", request.media);
    formData.append("security_level", request.securityLevel);
    return api
      .post("/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      })
      .then((res) => res.data as PhotoUploadResponse);
  },

  delete: async function (id: string): Promise<void> {
    return api.delete(`/photos/${id}`);
  },

  getGoodPhotos: async function (
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedResultData<PhotoDto>> {
    return api
      .get("/photos/good-pictures", { params: { page, pageSize } })
      .then((res) => res.data);
  },

  getGoodPhotoPosition: async function (
    photoId: string,
    pageSize?: number,
  ): Promise<PhotoPositionDto> {
    return api
      .get(`/photos/good-pictures/${photoId}/position`, {
        params: { pageSize },
      })
      .then((res) => res.data);
  },

  getById: async function (id: string): Promise<PhotoDto> {
    return api.get(`photos/${id}`).then((res) => res.data);
  },

  search: async function (
    photoSearch: PhotoSearch,
  ): Promise<PaginatedResult<PhotoDto>> {
    let queryString = "";

    for (const key in photoSearch) {
      if (Object.prototype.hasOwnProperty.call(photoSearch, key)) {
        const value = photoSearch[key];

        // Check for default values based on type
        if (
          (typeof value === "string" || typeof value === "boolean") &&
          value !== "" &&
          value !== null &&
          value !== undefined
        ) {
          queryString += `${key}=${encodeURIComponent(String(value))}&`;
        } else if (Array.isArray(value) && value.length > 0) {
          // Serialize array-type properties into separate query parameters
          value.forEach((tag) => {
            console.log(tag, "tag");
            queryString += `${key}=${encodeURIComponent(String(tag))}&`;
          });
        }
      }
    }
    // Remove trailing '&' from the queryString
    queryString = queryString.slice(0, -1);
    return api.get(`/photos?${queryString}`);
  },

  updateGoodPicture: async function (
    request: PhotoGoodPictureToggleRequestDto,
  ) {
    return api.put(`/photos/${request.photoId}/good-picture`, request);
  },
};
