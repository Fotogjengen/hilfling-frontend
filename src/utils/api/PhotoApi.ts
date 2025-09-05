import { api } from "./api";
import { Photo, PhotoDto } from "../../../generated";
import { PaginatedResult } from "./types";

export interface PhotoSearch {
  motive?: string;
  place?: string;
  gang?: string;
  album?: string;
  category?: string;
  tag?: string[];
  isGoodPic?: boolean;
  isAnalog?: boolean;
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

  getPhotoCount: async function (): Promise<Number> {
    return api
      .get("/photos/count")
      .then((res) => res.data.PromiseResult)
      .catch((e) => {
        console.log(e);
      });
  },

  getAllByMotiveId: async function (id: string): Promise<PhotoDto[]> {
    return api.get(`/photos/motive/${id}`).then((res) => res.data.currentList);
  },

  post: async function (photo: Photo): Promise<Photo> {
    return api.post("/photos", photo);
  },

  batchUpload: async function (
    photos: FormData,
    onUploadProgress?: (progressEvent: ProgressEvent) => void,
  ): Promise<any> {
    console.log(photos);
    return api.post("/photos/upload", photos, {
      onUploadProgress,
    });
  },

  getGoodPhotos: async function (
    page?: string,
    pageSize?: string,
  ): Promise<PhotoDto[]> {
    return api
      .get("/photos/goodPhotos", { params: { page, pageSize } })
      .then((res) => res.data.currentList);
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
};
