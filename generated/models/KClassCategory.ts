/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Category } from "./Category";
import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionCategory } from "./KFunctionCategory";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KClassCategory = {
  visibility?: KClassCategory.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: Category;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionCategory>;
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

export namespace KClassCategory {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
