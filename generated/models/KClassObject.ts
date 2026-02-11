/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KFunctionObject } from "./KFunctionObject";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KClassObject = {
  visibility?: KClassObject.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: any;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionObject>;
  open?: boolean;
  final?: boolean;
  abstract?: boolean;
  members?: Array<KCallableObject>;
  sealed?: boolean;
  qualifiedName?: string;
  supertypes?: Array<KType>;
  annotations?: Array<any>;
};

export namespace KClassObject {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
