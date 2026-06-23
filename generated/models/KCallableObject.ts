/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KParameter } from "./KParameter";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
export type KCallableObject = {
  isSuspend: boolean;
  visibility?: KCallableObject.visibility;
  name: string;
  typeParameters: Array<KTypeParameter>;
  returnType: KType;
  isFinal: boolean;
  isOpen: boolean;
  parameters: Array<KParameter>;
  isAbstract: boolean;
  annotations: Array<any>;
};
export namespace KCallableObject {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
