/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalUserId } from "./ExternalUserId";
import type { SecurityLevelDto } from "./SecurityLevelDto";
export type ExternalUserDto = {
  externalUserId: ExternalUserId;
  username: string;
  password?: string | null;
  email?: string | null;
  fullName?: string | null;
  securityLevel?: SecurityLevelDto | null;
  description?: string | null;
  isActive: boolean;
};
