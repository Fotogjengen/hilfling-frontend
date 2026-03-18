/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */


import type { PurchaseOrderId } from "./PurchaseOrderId";
import type { ZipCode } from "./ZipCode";

export type PurchaseOrderDto = {
  purchaseOrderId?: PurchaseOrderId;
  name?: string;
  email?: string;
  address?: string;
  zipCode?: ZipCode;
  city?: string;
  sendByPost?: boolean;
  comment?: string;
  completed?: boolean;
};
