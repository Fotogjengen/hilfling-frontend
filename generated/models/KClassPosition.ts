/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionPosition } from "./KFunctionPosition";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
import type { Position } from "./Position";

export type KClassPosition = {
  visibility?: KClassPosition.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: Position;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionPosition>;
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

export namespace KClassPosition {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
