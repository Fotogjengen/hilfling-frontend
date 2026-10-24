/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { SemesterStart } from "./SemesterStart";
import type { UserUploadId } from "./UserUploadId";
export type PhotoGangBangerPatchRequestDto = {
  photoGangBangerId: PhotoGangBangerId;
  semesterStart?: SemesterStart | null;
  isActive?: boolean | null;
  isPang?: boolean | null;
  name?: string | null;
  foodPreference?: string | null;
  birthday?: string | null;
  username?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profilePictureId?: UserUploadId | null;
};
