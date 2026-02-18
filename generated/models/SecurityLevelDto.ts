/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SecurityLevelId } from "./SecurityLevelId";

export type SecurityLevelDto = {
  securityLevelId: SecurityLevelId;
  securityLevelType: SecurityLevelDto.securityLevelType;
};

export namespace SecurityLevelDto {
  export enum securityLevelType {
    FG = "FG",
    HUSFOLK = "HUSFOLK",
    ALLE = "ALLE",
    PROFILE = "PROFILE",
  }
}
