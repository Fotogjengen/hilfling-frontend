/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SecurityLevelDto } from "./SecurityLevelDto";

export type PageSecurityLevelDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<SecurityLevelDto>;
};
