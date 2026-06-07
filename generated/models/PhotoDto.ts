/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GangDto } from "./GangDto";
import type { MotiveDto } from "./MotiveDto";
import type { PhotoGangBangerDto } from "./PhotoGangBangerDto";
import type { PhotoId } from "./PhotoId";
import type { SecurityLevelDto } from "./SecurityLevelDto";
export type PhotoDto = {
  photoId: PhotoId;
  goodPicture: boolean;
  analog: boolean;
  imageNumber: number;
  pageNumber: number;
  imageProd?: string;
  imageWeb: string;
  imageThumb: string;
  motive: MotiveDto;
  securityLevel: SecurityLevelDto;
  gang?: GangDto;
  photoGangBangerDto: PhotoGangBangerDto;
  dateTaken: string;
};
