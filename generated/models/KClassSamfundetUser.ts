/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionSamfundetUser } from "./KFunctionSamfundetUser";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
import type { SamfundetUser } from "./SamfundetUser";

export type KClassSamfundetUser = {
  visibility?: KClassSamfundetUser.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: SamfundetUser;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionSamfundetUser>;
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

export namespace KClassSamfundetUser {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
