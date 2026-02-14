/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassPhotographyRequest } from "./KClassPhotographyRequest";

export type PhotographyRequest = {
  description?: string;
  endTime?: string;
  type?: string;
  name?: string;
  startTime?: string;
  place?: string;
  intern?: boolean;
  email?: string;
  phone?: string;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassPhotographyRequest;
};
