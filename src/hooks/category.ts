import { CategoryApi } from "@/utils/api/CategoryApi";
import { toast } from "@/components/ui/overlay/Toaster";
import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import { CategoryPatchRequestDto } from "../../generated";


export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryApi.getAll().then((res) => res.data.currentList),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => CategoryApi.deleteById(categoryId),
    onSuccess: (_,categoryId) => {
      void queryClient.invalidateQueries({
        queryKey: ["category"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["category", categoryId],
      });
      toast.success("Kategorien ble slettet.")
    },
    onError: (error) => {
      toast.error("Kunne ikke slette kategori.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdateCAtegoey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: CategoryPatchRequestDto) => CategoryApi.patch(category),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast.success("Kategorien ble oppdatert.")
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere kategori.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};
