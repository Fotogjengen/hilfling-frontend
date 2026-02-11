/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Email } from "./Email";
import type { PhoneNumber } from "./PhoneNumber";
import type { SamfundetUserId } from "./SamfundetUserId";
import type { SecurityLevelDto } from "./SecurityLevelDto";

export type SamfundetUserDto = {
  samfundetUserId?: SamfundetUserId;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: PhoneNumber;
  email?: Email;
  profilePicturePath?: string;
  sex?: string;
  securituLevel?: SecurityLevelDto;
};
