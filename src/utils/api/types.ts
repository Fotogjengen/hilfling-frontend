export interface PaginatedResult<T> {
  config: object;
  headers: object;
  request: any;
  status: number;
  statusText: string;
  data: {
    currentList: T[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}
export interface PaginatedResultData<T> {
  currentList: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export type DeletedResult = {
  config: object;
  headers: object;
  request: any;
  status: number;
  statusText: string;
  data: number;
};
