/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { Email } from './Email';
import type { KClassSamfundetUser } from './KClassSamfundetUser';
import { PhoneNumber } from './PhoneNumber';
import { SamfundetUserId } from './SamfundetUserId';
import type { SecurityLevel } from './SecurityLevel';
import { SecurityLevelDto } from './SecurityLevelDto';

export type SamfundetUser = {
    securityLevel?: SecurityLevel;
    email?: Email;
    username?: string;
    profilePicturePath?: string;
    phoneNumber?: PhoneNumber;
    sex?: string;
    firstName?: string;
    lastName?: string;
    samfundetUserId?: SamfundetUserId;
    dateCreated?: string;
    properties?: Record<string, any>;
    entityClass?: KClassSamfundetUser;
}
