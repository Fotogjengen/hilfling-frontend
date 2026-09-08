import { api } from "./api";

export interface InternalImage {
  id: string;
  ownerId: string;
  securityLevel: "ALLE" | "FG" | "HUSFOLK";
  purpose: "GENERAL" | "PROFILE";
  status: "PENDING" | "READY" | "DELETING";
  originalName: string;
  prod: string | null;
  web: string | null;
  thumb: string | null;
  contentType: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  dateCreated: string;
}

export const InternalImageApi = {
  upload: async (
    media: File,
    securityLevel: InternalImage["securityLevel"] = "FG",
  ): Promise<InternalImage> => {
    const formData = new FormData();
    formData.append("media", media);
    formData.append("securityLevel", securityLevel);
    return api
      .post<InternalImage>("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
  get: async (id: string): Promise<InternalImage> =>
    api.get<InternalImage>(`/images/${id}`).then((res) => res.data),
  getMine: async (): Promise<InternalImage[]> =>
    api.get<InternalImage[]>("/images").then((res) => res.data),
  delete: async (id: string): Promise<void> => {
    await api.delete(`/images/${id}`);
  },
};
