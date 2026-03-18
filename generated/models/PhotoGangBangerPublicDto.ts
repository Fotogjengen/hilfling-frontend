/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PhotoGangBangerId } from "./PhotoGangBangerId";
import type { PositionDto } from "./PositionDto";
import type { SamfundetUserPublicDto } from "./SamfundetUserPublicDto";

export type PhotoGangBangerPublicDto = {
  photoGangBangerId?: PhotoGangBangerId;
  semesterStart?: string;
  city?: string;
  samfundetUser?: SamfundetUserPublicDto;
  position?: PositionDto;
  active?: boolean;
  pang?: boolean;
};
