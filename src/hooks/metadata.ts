import { useQuery } from "@tanstack/react-query";
import { PhotoDto } from "../../generated";
import { parse } from "exifr";

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
};

function loadImageSize(src: string) {
  return new Promise<{ width: number; height: number } | undefined>(
    (resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(undefined);
      img.src = src;
    },
  );
}

export const useMetadata = (photo: PhotoDto) => {
  return useQuery({
    queryKey: ["photo", photo.photoId, "metadata"],
    queryFn: async (): Promise<PhotoExif> => {
      if (!photo.imageProd) {
        throw new Error("No photo to fetch metadata from");
      }

      const data = await parse(photo.imageProd, [
        "Model",
        "LensModel",
        "ISO",
        "FNumber",
        "ExposureTime",
        "FocalLength",
        "ExposureCompensation",
        "Flash",
        "ExifImageWidth",
        "ExifImageHeight",
      ]);

      const size =
        data?.ExifImageWidth && data?.ExifImageHeight
          ? { width: data.ExifImageWidth, height: data.ExifImageHeight }
          : await loadImageSize(photo.imageProd);

      return {
        model: data?.Model,
        lensModel: data?.LensModel,
        iso: data?.ISO,
        fNumber: data?.FNumber,
        exposureTime: data?.ExposureTime,
        focalLength: data?.FocalLength,
        exposureCompensation: data?.ExposureCompensation,
        flash: data?.Flash,
        imageWidth: size?.width,
        imageHeight: size?.height,
      };
    },
  });
};
