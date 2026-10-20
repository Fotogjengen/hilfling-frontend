/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { SemesterStart } from "./SemesterStart";
import type { UserUploadId } from "./UserUploadId";
export type PhotoGangBangerPatchRequestDto = {
  photoGangBangerId: PhotoGangBangerId;
  semesterStart?: SemesterStart;
  isActive?: boolean;
  isPang?: boolean;
  name?: string;
  foodPreference?: string;
  birthday?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  profilePictureId?: UserUploadId;
};
