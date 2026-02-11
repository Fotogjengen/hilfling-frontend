/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionPhotographyRequest } from "./KFunctionPhotographyRequest";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
import type { PhotographyRequest } from "./PhotographyRequest";

export type KClassPhotographyRequest = {
  visibility?: KClassPhotographyRequest.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: PhotographyRequest;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionPhotographyRequest>;
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

export namespace KClassPhotographyRequest {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
