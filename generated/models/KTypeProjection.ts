/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KType } from "./KType";

export type KTypeProjection = {
  variance?: KTypeProjection.variance;
  type?: KType;
};

export namespace KTypeProjection {
  export enum variance {
    INVARIANT = "INVARIANT",
    IN = "IN",
    OUT = "OUT",
  }
}
