/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PhotoTagDto } from "./PhotoTagDto";

export type PagePhotoTagDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<PhotoTagDto>;
};
