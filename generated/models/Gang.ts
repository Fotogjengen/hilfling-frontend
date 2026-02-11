/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassGang } from "./KClassGang";

export type Gang = {
  name?: string;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassGang;
};
