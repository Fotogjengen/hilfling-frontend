/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassEventOwner } from "./KClassEventOwner";

export type EventOwner = {
  name?: string;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassEventOwner;
};
