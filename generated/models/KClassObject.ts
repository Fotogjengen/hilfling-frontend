/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KCallableObject } from "./KCallableObject";
import type { KFunctionObject } from "./KFunctionObject";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
export type KClassObject = {
  sealedSubclasses: Array<KClassObject>;
  isInner: boolean;
  isCompanion: boolean;
  isFun: boolean;
  isValue: boolean;
  visibility?: KClassObject.visibility;
  qualifiedName?: string;
  members: Array<KCallableObject>;
  objectInstance?: any;
  supertypes: Array<KType>;
  isData: boolean;
  typeParameters: Array<KTypeParameter>;
  simpleName?: string;
  isFinal: boolean;
  isOpen: boolean;
  constructors: Array<KFunctionObject>;
  isSealed: boolean;
  isAbstract: boolean;
  annotations: Array<any>;
};
export namespace KClassObject {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
