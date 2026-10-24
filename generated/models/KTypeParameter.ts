/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KType } from "./KType";
export type KTypeParameter = {
  variance: KTypeParameter.variance;
  isReified: boolean;
  upperBounds: Array<KType>;
  name: string;
};
export namespace KTypeParameter {
  export enum variance {
    INVARIANT = "INVARIANT",
    IN = "IN",
    OUT = "OUT",
  }
}
