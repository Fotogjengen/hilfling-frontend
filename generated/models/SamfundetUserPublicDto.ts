/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SamfundetUserId } from "./SamfundetUserId";

export type SamfundetUserPublicDto = {
  samfundetUserId?: SamfundetUserId;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  profilePicturePath?: string;
};
