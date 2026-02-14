/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Album } from "./Album";
import type { Category } from "./Category";
import type { Gang } from "./Gang";
import type { KClassPhoto } from "./KClassPhoto";
import type { Motive } from "./Motive";
import type { PhotoGangBanger } from "./PhotoGangBanger";
import type { Place } from "./Place";
import type { SecurityLevel } from "./SecurityLevel";

export type Photo = {
  gang?: Gang;
  motive?: Motive;
  securityLevel?: SecurityLevel;
  goodPicture?: boolean;
  photoGangBanger?: PhotoGangBanger;
  smallUrl?: string;
  place?: Place;
  largeUrl?: string;
  category?: Category;
  mediumUrl?: string;
  album?: Album;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassPhoto;
};
