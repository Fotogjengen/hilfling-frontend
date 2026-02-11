/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionPhotoGangBanger } from "./KFunctionPhotoGangBanger";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
import type { PhotoGangBanger } from "./PhotoGangBanger";

export type KClassPhotoGangBanger = {
  visibility?: KClassPhotoGangBanger.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: PhotoGangBanger;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionPhotoGangBanger>;
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

export namespace KClassPhotoGangBanger {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
