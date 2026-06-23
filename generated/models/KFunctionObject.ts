/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KParameter } from "./KParameter";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
export type KFunctionObject = {
  isInline: boolean;
  isOperator: boolean;
  isInfix: boolean;
  isExternal: boolean;
  isSuspend: boolean;
  visibility?: KFunctionObject.visibility;
  name: string;
  typeParameters: Array<KTypeParameter>;
  returnType: KType;
  isFinal: boolean;
  isOpen: boolean;
  parameters: Array<KParameter>;
  isAbstract: boolean;
  annotations: Array<any>;
};
export namespace KFunctionObject {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
