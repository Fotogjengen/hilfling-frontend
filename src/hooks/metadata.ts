import { useQuery } from "@tanstack/react-query";
import { PhotoDto } from "../../generated";

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

export const useMetadata = (photo: PhotoDto) => {
  return useQuery({
    queryKey: ["photo", photo.photoId, "metadata"],
    staleTime: Infinity,
    queryFn: async (): Promise<PhotoExif> => {
      if (!photo.imageProd) {
        throw new Error("No photo to fetch metadata from");
      }

      const url = photo.imageProd.replace("/media/", "/media/metadata/");
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
