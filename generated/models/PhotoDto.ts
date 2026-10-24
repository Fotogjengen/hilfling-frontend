/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GangDto } from "./GangDto";
import type { MediaDto } from "./MediaDto";
import type { MotiveDto } from "./MotiveDto";
import type { PhotoGangBangerDto } from "./PhotoGangBangerDto";
import type { PhotoId } from "./PhotoId";
import type { SecurityLevelDto } from "./SecurityLevelDto";
export type PhotoDto = {
  photoId: PhotoId;
  goodPicture: boolean;
  imageNumber: number;
  pageNumber: number;
  imageProd?: string | null;
  imageWeb?: string | null;
  imageThumb: string;
  motive: MotiveDto;
  media: MediaDto;
  gang?: GangDto | null;
  photoGangBangerDto: PhotoGangBangerDto;
  dateUploaded: string;
  securityLevel: SecurityLevelDto;
};
