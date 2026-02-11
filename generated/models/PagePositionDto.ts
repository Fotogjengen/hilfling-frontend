/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionDto } from "./PositionDto";

export type PagePositionDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<PositionDto>;
};
