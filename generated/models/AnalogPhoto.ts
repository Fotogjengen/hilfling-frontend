/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassAnalogPhoto } from "./KClassAnalogPhoto";
import type { Photo } from "./Photo";

export type AnalogPhoto = {
  pageNumber?: number;
  imageNumber?: number;
  photo?: Photo;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassAnalogPhoto;
};
