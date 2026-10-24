/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoGangBangerDto } from "./PhotoGangBangerDto";
import type { SecurityLevelDto } from "./SecurityLevelDto";
import type { UserUploadId } from "./UserUploadId";
export type UserUploadDto = {
  userUploadId: UserUploadId;
  securityLevel?: SecurityLevelDto | null;
  link?: string | null;
  photoGangBangerDto: PhotoGangBangerDto;
  dateUploaded: string;
};
