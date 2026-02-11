/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Email } from "./Email";
import type { PhoneNumber } from "./PhoneNumber";
import type { SamfundetUserId } from "./SamfundetUserId";

export type SamfundetUserPublicDto = {
  samfundetUserId?: SamfundetUserId;
  firstName?: string;
  lastName?: string;
  phoneNumber?: PhoneNumber;
  email?: Email;
  profilePicturePath?: string;
};
