/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KParameter } from "./KParameter";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KCallableObject = {
  visibility?: KCallableObject.visibility;
  name?: string;
  typeParameters?: Array<KTypeParameter>;
  returnType?: KType;
  open?: boolean;
  parameters?: Array<KParameter>;
  final?: boolean;
  abstract?: boolean;
  annotations?: Array<any>;
};

export namespace KCallableObject {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
