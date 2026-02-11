/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionPlace } from "./KFunctionPlace";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
import type { Place } from "./Place";

export type KClassPlace = {
  visibility?: KClassPlace.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: Place;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionPlace>;
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

export namespace KClassPlace {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
