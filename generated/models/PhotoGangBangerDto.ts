/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { PositionDto } from "./PositionDto";
import type { SamfundetUserDto } from "./SamfundetUserDto";
import type { SemesterStart } from "./SemesterStart";

export type PhotoGangBangerDto = {
  photoGangBangerId?: PhotoGangBangerId;
  relationShipStatus?: relationShipStatus;
  semesterStart?: SemesterStart;
  address?: string;
  zipCode?: string;
  city?: string;
  samfundetUser?: SamfundetUserDto;
  position?: PositionDto;
  isActive?: boolean;
  isPang?: boolean;
};

// export namespace PhotoGangBangerDto {}
export enum relationShipStatus {
  SINGLE = "single",
  RELATIONSHIP = "relationship",
  MARRIED = "married",
}
