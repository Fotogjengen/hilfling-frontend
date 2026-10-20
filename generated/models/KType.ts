/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KClassifier } from "./KClassifier";
import type { KTypeProjection } from "./KTypeProjection";
export type KType = {
  classifier?: KClassifier;
  isMarkedNullable: boolean;
  arguments: Array<KTypeProjection>;
  annotations: Array<any>;
};
