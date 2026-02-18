/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GangDto } from "./GangDto";

export type PageGangDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<GangDto>;
};
