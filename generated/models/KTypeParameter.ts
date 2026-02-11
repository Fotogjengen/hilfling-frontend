/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KType } from "./KType";

export type KTypeParameter = {
  reified?: boolean;
  variance?: KTypeParameter.variance;
  upperBounds?: Array<KType>;
  name?: string;
};

export namespace KTypeParameter {
  export enum variance {
    INVARIANT = "INVARIANT",
    IN = "IN",
    OUT = "OUT",
  }
}
