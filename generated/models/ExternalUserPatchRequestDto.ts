/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalUserId } from "./ExternalUserId";
import type { SecurityLevelDto } from "./SecurityLevelDto";
export type ExternalUserPatchRequestDto = {
  externalUserId: ExternalUserId;
  username?: string | null;
  password?: string | null;
  email?: string | null;
  fullName?: string | null;
  securityLevel?: SecurityLevelDto | null;
  description?: string | null;
  isActive?: boolean | null;
};
