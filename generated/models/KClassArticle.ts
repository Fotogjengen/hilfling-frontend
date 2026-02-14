/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Article } from "./Article";
import type { KCallableObject } from "./KCallableObject";
import type { KClassObject } from "./KClassObject";
import type { KFunctionArticle } from "./KFunctionArticle";
import type { KType } from "./KType";
import type { KTypeParameter } from "./KTypeParameter";

export type KClassArticle = {
  visibility?: KClassArticle.visibility;
  data?: boolean;
  inner?: boolean;
  companion?: boolean;
  objectInstance?: Article;
  typeParameters?: Array<KTypeParameter>;
  simpleName?: string;
  constructors?: Array<KFunctionArticle>;
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

export namespace KClassArticle {
  export enum visibility {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    INTERNAL = "INTERNAL",
    PRIVATE = "PRIVATE",
  }
}
