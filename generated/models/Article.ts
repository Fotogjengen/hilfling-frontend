/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassArticle } from "./KClassArticle";
import type { PhotoGangBanger } from "./PhotoGangBanger";
import type { SecurityLevel } from "./SecurityLevel";

export type Article = {
  title?: string;
  securityLevel?: SecurityLevel;
  photoGangBanger?: PhotoGangBanger;
  plainText?: string;
  id?: string;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassArticle;
};
