/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PlaceDto } from "./PlaceDto";

export type PagePlaceDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<PlaceDto>;
};
