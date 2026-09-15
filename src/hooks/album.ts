import { AlbumApi } from "@/utils/api/AlbumApi";
import { AlbumPatchRequestDto } from "../../generated";
import { toast } from "@/components/ui/overlay/Toaster";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAlbums = () => {
  return useQuery({
    queryKey: ["albums"],
    queryFn: () => AlbumApi.getAll().then((res) => res.data.currentList),
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (albumId: string) => AlbumApi.deleteById(albumId),
    onSuccess: (_,albumId) => {
      void queryClient.invalidateQueries({
        queryKey: ["albums"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["album", albumId],
      });
      toast.success("Albumet ble slettet.")
    },
    onError: (error) => {
      toast.error("Kunne ikke slette album.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (album: AlbumPatchRequestDto) => AlbumApi.patch(album),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast.success("Albumet ble oppdatert.")
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere albumet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};
