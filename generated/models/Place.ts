/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassPlace } from "./KClassPlace";

export type Place = {
  name?: string;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassPlace;
};
