/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PurchaseOrderDto } from "./PurchaseOrderDto";

export type PagePurchaseOrderDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<PurchaseOrderDto>;
};
