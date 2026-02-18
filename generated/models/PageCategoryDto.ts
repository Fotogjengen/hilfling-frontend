/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CategoryDto } from "./CategoryDto";

export type PageCategoryDto = {
  offset?: number;
  limit?: number;
  totalRecords?: number;
  pageSize?: number;
  totalPages?: number;
  currentList?: Array<CategoryDto>;
};
