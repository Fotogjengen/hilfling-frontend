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
export type MotiveDto = {
  motiveId: MotiveId;
  title: string;
  date: string;
  categoryDto: CategoryDto;
  eventOwnerDto: EventOwnerDto;
  placeDto: PlaceDto;
  securityLevel: SecurityLevelDto;
  albumDto?: AlbumDto;
  analogAlbumDto?: AlbumDto;
  dateCreated?: string;
};
