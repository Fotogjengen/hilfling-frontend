/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */


import type { KClassPosition } from "./KClassPosition";
import { PositionId } from "./PositionId";

export type Position = {
  title?: string;
  email?: string;
  positionId?: PositionId;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassPosition;
};
