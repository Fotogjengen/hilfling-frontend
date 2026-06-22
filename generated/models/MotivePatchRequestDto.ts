/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlbumDto } from "./AlbumDto";
import type { CategoryDto } from "./CategoryDto";
import type { EventOwnerDto } from "./EventOwnerDto";
import type { MotiveId } from "./MotiveId";
export type MotivePatchRequestDto = {
  motiveId: MotiveId;
  title?: string;
  categoryDto?: CategoryDto;
  eventOwnerDto?: EventOwnerDto;
  albumDto?: AlbumDto;
};
