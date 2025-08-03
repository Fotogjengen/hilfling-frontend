import { api } from "./api";
import { CategoryDto } from "../../../generated";
import { DeletedResult, PaginatedResult } from "./types";

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export const CategoryApi = {
  getAll: async function (
    params?: PaginationParams,
  ): Promise<PaginatedResult<CategoryDto>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined)
      searchParams.set("page", params.page.toString());
    if (params?.pageSize !== undefined)
      searchParams.set("pageSize", params.pageSize.toString());

    return api.get(
      `/categories${searchParams.toString() ? `?${searchParams}` : ""}`,
    );
  },
  deleteById: async function (id: string): Promise<DeletedResult> {
    return api.delete(`/categories/${id}`);
  },
  // eslint-disable-next-line
  post: async function (category: any): Promise<number> {
    return api
      .post("/categories", category)
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
