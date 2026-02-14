/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassifier } from "./KClassifier";
import type { KTypeProjection } from "./KTypeProjection";

export type KType = {
  markedNullable?: boolean;
  classifier?: KClassifier;
  arguments?: Array<KTypeProjection>;
};
