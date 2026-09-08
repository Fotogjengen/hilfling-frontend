import { useQuery } from "@tanstack/react-query";
import { PhotoDto } from "../../generated";
import { PhotoQuality } from "@/types";

export type PhotoExif = {
  model?: string;
  lensModel?: string;
  iso?: number;
  fNumber?: number;
  exposureTime?: number;
  focalLength?: number;
  exposureCompensation?: number;
  flash?: string;
  imageWidth?: number;
  imageHeight?: number;
  fileSize?: number;
};

export const useMetadata = (photo: PhotoDto, quality?: PhotoQuality) => {
  const getPhotoUrl = (photo: PhotoDto, quality?: PhotoQuality) => {
    switch (quality || "prod") {
      case "thumb":
        return photo.imageThumb;
      case "web":
        if (!photo.imageWeb) {
          throw new Error("The user does not have access to imageWeb");
        }
        return photo.imageWeb;
      case "prod":
        if (!photo.imageProd) {
          throw new Error("The user does not have access to imageProd");
        }
        return photo.imageProd;
    }
  };

  return useQuery({
    queryKey: ["photo", photo.photoId, "metadata", quality],
    staleTime: Infinity,
    queryFn: async (): Promise<PhotoExif> => {
      const rawUrl = getPhotoUrl(photo, quality);

      const url = rawUrl.replace("/media/", "/media/metadata/");
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        throw new Error(`Failed to fetch metadata (${res.status})`);
      }

      const data = await res.json();
      return Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== null),
      );
    },
  });
};
