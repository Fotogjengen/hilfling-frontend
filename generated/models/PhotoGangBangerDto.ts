/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MemberPositionDto } from "./MemberPositionDto";
import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { SemesterStart } from "./SemesterStart";
import type { UserUploadDto } from "./UserUploadDto";
export type PhotoGangBangerDto = {
  photoGangBangerId: PhotoGangBangerId;
  semesterStart: SemesterStart;
  isActive: boolean;
  isPang: boolean;
  name: string;
  foodPreference?: string;
  birthday?: string;
  username: string;
  email: string;
  phoneNumber: string;
  positions: Array<MemberPositionDto>;
  profilePicture?: UserUploadDto;
};
