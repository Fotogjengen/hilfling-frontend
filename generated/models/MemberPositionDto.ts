/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Email } from "./Email";
import type { PositionId } from "./PositionId";
import type { SemesterStart } from "./SemesterStart";
export type MemberPositionDto = {
  positionId: PositionId;
  title: string;
  email: Email;
  semesterStart: SemesterStart;
  isActive: boolean;
};
