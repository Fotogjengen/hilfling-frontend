/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventOwnerDto } from "./EventOwnerDto";

export type PageEventOwnerDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<EventOwnerDto>;
};
