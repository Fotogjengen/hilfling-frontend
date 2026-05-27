/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GangDto } from "./GangDto";
import type { MotiveDto } from "./MotiveDto";
import type { PhotoGangBangerDto } from "./PhotoGangBangerDto";
export type PhotoUploadRequestDto = {
  goodPicture: boolean;
  analog: boolean;
  motive: MotiveDto;
  gang?: GangDto;
  photoGangBangerDto: PhotoGangBangerDto;
  dateTaken: string;
};
