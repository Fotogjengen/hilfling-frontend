/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AlbumDto } from "./AlbumDto";
import type { CategoryDto } from "./CategoryDto";
import type { GangDto } from "./GangDto";
import type { MotiveDto } from "./MotiveDto";
import type { PhotoGangBangerDto } from "./PhotoGangBangerDto";
import type { PhotoId } from "./PhotoId";
import type { PhotoTagDto } from "./PhotoTagDto";
import type { PlaceDto } from "./PlaceDto";
import type { SecurityLevelDto } from "./SecurityLevelDto";

export type PhotoDto = {
  photoId: PhotoId;
  smallUrl: string;
  mediumUrl: string;
  largeUrl: string;
  motive: MotiveDto;
  placeDto: PlaceDto;
  securityLevel: SecurityLevelDto;
  gang: GangDto;
  albumDto: AlbumDto;
  categoryDto: CategoryDto;
  photoGangBangerDto: PhotoGangBangerDto;
  photoTags: Array<PhotoTagDto>;
  isGoodPicture: boolean;
};
