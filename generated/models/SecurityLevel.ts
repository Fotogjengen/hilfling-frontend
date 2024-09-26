/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KClassSecurityLevel } from './KClassSecurityLevel';
import { SecurityLevelId } from './SecurityLevelId';

export type SecurityLevel = {
    securityLevelType?: string;
    securityLevelId?: SecurityLevelId;
    dateCreated?: string;
    properties?: Record<string, any>;
    entityClass?: KClassSecurityLevel;
}
