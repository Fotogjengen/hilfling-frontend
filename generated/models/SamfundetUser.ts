/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassSamfundetUser } from "./KClassSamfundetUser";
import { SamfundetUserId } from "./SamfundetUserId";
import type { SecurityLevel } from "./SecurityLevel";
import { SecurityLevelDto } from "./SecurityLevelDto";

export type SamfundetUser = {
  securityLevel?: SecurityLevel;
  email?: string;
  username?: string;
  profilePicturePath?: string;
  phoneNumber?: string;
  sex?: string;
  firstName?: string;
  lastName?: string;
  samfundetUserId?: SamfundetUserId;
  dateCreated?: string;
  properties?: Record<string, any>;
  entityClass?: KClassSamfundetUser;
};
