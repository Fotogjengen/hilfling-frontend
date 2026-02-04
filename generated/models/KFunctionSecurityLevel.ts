/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KParameter } from "./KParameter";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KFunctionSecurityLevel = {
  inline?: boolean;
  operator?: boolean;
  infix?: boolean;
  suspend?: boolean;
  external?: boolean;
  visibility?: KFunctionSecurityLevel.visibility;
  name?: string;
  typeParameters?: Array<KTypeParameter>;
  returnType?: KType;
  open?: boolean;
  parameters?: Array<KParameter>;
  final?: boolean;
  abstract?: boolean;
  annotations?: Array<any>;
};

export namespace KFunctionSecurityLevel {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
