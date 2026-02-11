/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnalogPhoto } from "./AnalogPhoto";
import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionAnalogPhoto } from "./KFunctionAnalogPhoto";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KClassAnalogPhoto = {
  visibility?: KClassAnalogPhoto.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: AnalogPhoto;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionAnalogPhoto>;
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

export namespace KClassAnalogPhoto {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
