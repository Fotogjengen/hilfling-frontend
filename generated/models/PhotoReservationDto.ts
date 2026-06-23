/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlbumDto } from "./AlbumDto";
import type { AlbumId } from "./AlbumId";
export type PhotoReservationDto = {
  albumId: AlbumId;
  pageNumber: number;
  imageNumber: number;
  reservedAt: string;
  album?: AlbumDto;
};
