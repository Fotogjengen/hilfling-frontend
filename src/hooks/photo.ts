import { PhotoApi, PhotoUploadRequest } from "@/utils/api/PhotoApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/overlay/Toaster";
import { AxiosProgressEvent } from "axios";
import { PhotoGoodPictureToggleRequestDto } from "../../generated";

export const usePhotosByMotiveId = (motiveId: string) => {
  return useQuery({
    queryKey: ["photos", "motive", motiveId],
    queryFn: () => PhotoApi.getAllByMotiveId(motiveId),
    enabled: !!motiveId,
  });
};

export const useUploadPhoto = (
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PhotoUploadRequest) =>
      PhotoApi.upload(request, onUploadProgress),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", variables.motiveId],
      });
    },
    onError: (error) => {
      toast.error("Kunne ikke laste opp bildet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdateGoodPicture = (motiveId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PhotoGoodPictureToggleRequestDto) =>
      PhotoApi.updateGoodPicture(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", motiveId],
      });
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere bildet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useDeletePhoto = (motiveId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => PhotoApi.delete(photoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", motiveId],
      });
    },
    onError: (error) => {
      toast.error("Kunne ikke slette bildet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};
