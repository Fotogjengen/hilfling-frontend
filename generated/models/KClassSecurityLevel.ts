/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionSecurityLevel } from "./KFunctionSecurityLevel";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
import type { SecurityLevel } from "./SecurityLevel";

export type KClassSecurityLevel = {
  visibility?: KClassSecurityLevel.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: SecurityLevel;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionSecurityLevel>;
  open?: boolean;
  final?: boolean;
  abstract?: boolean;
  members?: Array<KCallableObject>;
  sealed?: boolean;
  qualifiedName?: string;
  nestedClasses?: Array<KClassObject>;
  supertypes?: Array<KType>;
  annotations?: Array<any>;
};

export namespace KClassSecurityLevel {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
