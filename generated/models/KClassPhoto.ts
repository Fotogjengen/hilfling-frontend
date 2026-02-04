/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionPhoto } from "./KFunctionPhoto";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
import type { Photo } from "./Photo";

export type KClassPhoto = {
  visibility?: KClassPhoto.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: Photo;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionPhoto>;
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

export namespace KClassPhoto {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
