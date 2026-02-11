/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Email } from "./Email";
import type { PurchaseOrderId } from "./PurchaseOrderId";
import type { ZipCode } from "./ZipCode";

export type PurchaseOrderDto = {
  purchaseOrderId?: PurchaseOrderId;
  name?: string;
  email?: Email;
  address?: string;
  zipCode?: ZipCode;
  city?: string;
  sendByPost?: boolean;
  comment?: string;
  completed?: boolean;
};
