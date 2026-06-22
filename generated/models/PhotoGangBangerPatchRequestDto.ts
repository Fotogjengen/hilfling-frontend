/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { SemesterStart } from "./SemesterStart";
export type PhotoGangBangerPatchRequestDto = {
  photoGangBangerId: PhotoGangBangerId;
  semesterStart?: SemesterStart;
  isActive?: boolean;
  isPang?: boolean;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  phoneNumber?: string;
};
