/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlbumDto } from "./AlbumDto";
import type { CategoryDto } from "./CategoryDto";
import type { EventOwnerDto } from "./EventOwnerDto";
import type { MotiveId } from "./MotiveId";
import type { PlaceDto } from "./PlaceDto";
import type { SecurityLevelDto } from "./SecurityLevelDto";
export type MotivePatchRequestDto = {
  motiveId: MotiveId;
  title?: string | null;
  date?: string | null;
  categoryDto?: CategoryDto | null;
  eventOwnerDto?: EventOwnerDto | null;
  placeDto?: PlaceDto | null;
  securityLevel?: SecurityLevelDto | null;
  albumDto?: AlbumDto | null;
  analogAlbumDto?: AlbumDto | null;
};
