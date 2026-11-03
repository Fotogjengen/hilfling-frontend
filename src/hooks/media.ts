import { MediaApi, MediaCreateRequest } from "@/utils/api/MediaApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/overlay/Toaster";
import { MediaPatchRequestDto } from "./../../generated";

export const useMedias = () => {
  return useQuery({
    queryKey: ["medias"],
    queryFn: () => MediaApi.getAll().then((res) => res.data.currentList),
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (MediaId: string) => MediaApi.deleteById(MediaId),
    onSuccess: (_, MediaId) => {
      void queryClient.invalidateQueries({
        queryKey: ["Medias"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["Media", MediaId],
      });
      toast.success("Mediaet ble slettet.");
    },
    onError: (error) => {
      toast.error("Kunne ikke slette Media.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (Media: MediaPatchRequestDto) => MediaApi.patch(Media),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["Medias"] });
      toast.success("Mediaet ble oppdatert.");
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere Mediaet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const usePostMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (Media: MediaCreateRequest) => MediaApi.post(Media),
    onSuccess: (_, MediaId) => {
      void queryClient.invalidateQueries({
        queryKey: ["Medias"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["Media", MediaId],
      });
      toast.success("Mediaet ble opprettet.");
    },
    onError: (error) => {
      toast.error("Kunne ikke opprette Media.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};
