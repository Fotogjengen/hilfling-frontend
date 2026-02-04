/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Album } from "./Album";
import type { Category } from "./Category";
import type { EventOwner } from "./EventOwner";
import type { KClassMotive } from "./KClassMotive";

export type Motive = {
  title?: string;
  category?: Category;
  album?: Album;
  eventOwner?: EventOwner;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassMotive;
};
