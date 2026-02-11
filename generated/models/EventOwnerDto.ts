/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventOwnerId } from "./EventOwnerId";

export type EventOwnerDto = {
  eventOwnerId: EventOwnerId;
  name: EventOwnerDto.name;
};

export namespace EventOwnerDto {
  export enum name {
    ISFIT = "ISFIT",
    UKA = "UKA",
    SAMFUNDET = "Samfundet",
  }
}
