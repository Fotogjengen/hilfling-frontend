/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassSamfundetUser } from "./KClassSamfundetUser";

export type SamfundetUserPublic = {
  email?: string;
  profilePicture?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  properties?: Record<string, any>;
  entityClass?: KClassSamfundetUser;
};
