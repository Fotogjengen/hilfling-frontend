/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassPhotoGangBanger } from "./KClassPhotoGangBanger";
import type { Position } from "./Position";
import type { SamfundetUserPublic } from "./SamfundetUserPublic";

export type PhotoGangBangerPublic = {
  semesterStart?: string;
  active?: boolean;
  pang?: boolean;
  samfundetUser?: SamfundetUserPublic;
  position?: Position;
  id?: string;
  properties?: Record<string, any>;
  entityClass?: KClassPhotoGangBanger;
};
