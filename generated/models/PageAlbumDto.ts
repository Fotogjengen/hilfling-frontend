/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AlbumDto } from "./AlbumDto";

export type PageAlbumDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<AlbumDto>;
};
