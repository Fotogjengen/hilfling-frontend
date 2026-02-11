/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Email } from "./Email";
import type { PositionId } from "./PositionId";

export type PositionDto = {
  positionId?: PositionId;
  title?: string;
  email?: Email;
};
