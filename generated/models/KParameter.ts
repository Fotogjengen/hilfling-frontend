/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KType } from "./KType";

export type KParameter = {
  vararg?: boolean;
  name?: string;
  type?: KType;
  index?: number;
  kind?: KParameter.kind;
  optional?: boolean;
  annotations?: Array<any>;
};

export namespace KParameter {
  export enum kind {
    INSTANCE = "INSTANCE",
    EXTENSION_RECEIVER = "EXTENSION_RECEIVER",
    VALUE = "VALUE",
  }
}
