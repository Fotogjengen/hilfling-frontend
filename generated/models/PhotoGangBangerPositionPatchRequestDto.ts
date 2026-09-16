/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { PositionDto } from "./PositionDto";
import type { SemesterStart } from "./SemesterStart";
export type PhotoGangBangerPositionPatchRequestDto = {
  photoGangBangerId: PhotoGangBangerId;
  semesterStart: SemesterStart;
  position?: PositionDto;
  semesterEnd?: SemesterStart;
};
