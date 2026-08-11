/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KParameter } from "./KParameter";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";
export type KFunctionPhotographyRequest = {
  isSuspend: boolean;
  isOperator: boolean;
  isExternal: boolean;
  isInfix: boolean;
  isInline: boolean;
  visibility?: KFunctionPhotographyRequest.visibility;
  name: string;
  typeParameters: Array<KTypeParameter>;
  returnType: KType;
  isFinal: boolean;
  isOpen: boolean;
  parameters: Array<KParameter>;
  isAbstract: boolean;
  annotations: Array<any>;
};
export namespace KFunctionPhotographyRequest {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
