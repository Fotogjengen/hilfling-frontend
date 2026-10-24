/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KType } from "./KType";
export type KParameter = {
  isVararg: boolean;
  kind: KParameter.kind;
  isOptional: boolean;
  name?: string | null;
  type: KType;
  index: number;
  annotations: Array<any>;
};
export namespace KParameter {
  export enum kind {
    INSTANCE = "INSTANCE",
    CONTEXT = "CONTEXT",
    EXTENSION_RECEIVER = "EXTENSION_RECEIVER",
    VALUE = "VALUE",
  }
}
