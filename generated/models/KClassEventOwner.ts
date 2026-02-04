/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventOwner } from "./EventOwner";
import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionEventOwner } from "./KFunctionEventOwner";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KClassEventOwner = {
  visibility?: KClassEventOwner.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: EventOwner;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionEventOwner>;
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

export namespace KClassEventOwner {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
