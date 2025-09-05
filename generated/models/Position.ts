/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { Email } from "./Email";
import type { KClassPosition } from "./KClassPosition";
import { PositionId } from "./PositionId";

export type Position = {
  title?: string;
  email?: Email;
  positionId?: PositionId;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassPosition;
};
