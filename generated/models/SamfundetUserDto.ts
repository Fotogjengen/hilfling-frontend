/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SamfundetUserId } from "./SamfundetUserId";
import type { SecurityLevelDto } from "./SecurityLevelDto";

export type SamfundetUserDto = {
  samfundetUserId?: SamfundetUserId;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
  profilePicturePath?: string;
  sex?: string;
  securituLevel?: SecurityLevelDto;
};
