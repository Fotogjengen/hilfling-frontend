/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalUserId } from "./ExternalUserId";
import type { SecurityLevelDto } from "./SecurityLevelDto";
export type ExternalUserPatchRequestDto = {
  externalUserId: ExternalUserId;
  username?: string;
  password?: string;
  email?: string;
  fullName?: string;
  securityLevel?: SecurityLevelDto;
  description?: string;
  isActive?: boolean;
};
