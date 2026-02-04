/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassAlbum } from "./KClassAlbum";

export type Album = {
  title?: string;
  analog?: boolean;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassAlbum;
};
