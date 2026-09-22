import { PlaceApi } from "@/utils/api/PlaceApi";
import { toast } from "@/components/ui/overlay/Toaster";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PlacePatchRequestDto } from "../../generated";

export const usePlaces = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: () => PlaceApi.getAll().then((res) => res.data.currentList),
  });
};
export const useDeletePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (placeId: string) => PlaceApi.deleteById(placeId),
    onSuccess: (_,placeId) => {
      void queryClient.invalidateQueries({
        queryKey: ["place"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["place", placeId],
      });
      toast.success("Stedet ble slettet.")
    },
    onError: (error) => {
      toast.error("Kunne ikke slette stedet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdatePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: PlacePatchRequestDto) => PlaceApi.patch(category),
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
