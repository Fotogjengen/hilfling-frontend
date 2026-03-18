/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { PositionDto } from "./PositionDto";
import type { SamfundetUserDto } from "./SamfundetUserDto";

export type PhotoGangBangerDto = {
  photoGangBangerId?: PhotoGangBangerId;
  semesterStart?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  samfundetUser?: SamfundetUserDto;
  position?: PositionDto;
  isActive?: boolean;
  isPang?: boolean;
};
