/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Album } from "./Album";
import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionAlbum } from "./KFunctionAlbum";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KClassAlbum = {
  visibility?: KClassAlbum.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: Album;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionAlbum>;
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

export namespace KClassAlbum {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
