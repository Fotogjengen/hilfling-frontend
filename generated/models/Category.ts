/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassCategory } from "./KClassCategory";

export type Category = {
  name?: string;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassCategory;
};
