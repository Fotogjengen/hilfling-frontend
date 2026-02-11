/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Gang } from "./Gang";
import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionGang } from "./KFunctionGang";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KClassGang = {
  visibility?: KClassGang.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: Gang;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionGang>;
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

export namespace KClassGang {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
