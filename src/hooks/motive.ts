import { MotiveApi } from "@/utils/api/MotiveApi";
import { MotiveCreateRequestDto, MotivePatchRequestDto } from "../../generated";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useMotives = () => {
  return useInfiniteQuery({
    queryKey: ["motives"],
    queryFn: ({ pageParam }) =>
      MotiveApi.getPage(pageParam).then((response) => response.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
  });
};

export const useMotiveSearch = (searchTerm: string) => {
  return useInfiniteQuery({
    queryKey: ["motives", "search", searchTerm],
    queryFn: ({ pageParam }) =>
      MotiveApi.search(searchTerm, pageParam).then((response) => response.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
    enabled: searchTerm.length > 0,
  });
};

export const useUpdateMotive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (motive: MotivePatchRequestDto) => MotiveApi.patch(motive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["motives"] });
    },
  });
};

export const useCreateMotive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (motive: MotiveCreateRequestDto) => MotiveApi.create(motive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["motives"] });
    },
  });
};

export const useDeleteMotive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MotiveApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["motives"] });
    },
  });
};

export const useDefaultMotive = () => {
  return useQuery({
    queryKey: ["motive", "defaults"],
    queryFn: () => MotiveApi.getDefaults(),
    staleTime: 1000 * 60 * 5, // we could increase this, the defaults should really never ever be stale
  });
};
