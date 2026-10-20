import { api } from "./api";
import type { UserUploadDto } from "../../../generated";

export interface UserUploadResponse {
  ok: boolean;
  link: string;
  userUpload: UserUploadDto;
}

export const UserUploadApi = {
  upload: async function (
    file: File,
    securityLevel: "ALLE" | "FG" = "ALLE",
  ): Promise<UserUploadResponse> {
    const formData = new FormData();
    formData.append("media", file);
    formData.append("security_level", securityLevel);
    const res = await api.post("/user-uploads/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as UserUploadResponse;
  },
};
