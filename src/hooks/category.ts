import { CategoryApi } from "@/utils/api/CategoryApi";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryApi.getAll().then((res) => res.data.currentList),
  });
};
