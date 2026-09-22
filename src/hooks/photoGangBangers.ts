import {
  PhotoGangBangerApi,
  type PhotoGangBangerCreateRequest,
} from "@/utils/api/PhotoGangBangerApi";
import { UserUploadApi } from "@/utils/api/UserUploadApi";
import type {
  PhotoGangBangerPatchRequestDto,
  PhotoGangBangerPositionsPutRequestDto,
} from "@/../generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/overlay/Toaster";
import { useAuth } from "@/contexts/AuthProvider";

export const useActivePhotoGangBangers = () => {
  return useQuery({
    queryKey: ["photoGangBangers", "active"],
    queryFn: () => PhotoGangBangerApi.getAllActivesPublic(),
  });
};

export const usePangPhotoGangBangers = () => {
  return useQuery({
    queryKey: ["photoGangBangers", "pang"],
    queryFn: () => PhotoGangBangerApi.getAllActivePangsPublic(),
  });
};

export const usePhotoGangBangers = () => {
  return useQuery({
    queryKey: ["photoGangBangers"],
    queryFn: () => PhotoGangBangerApi.getAll(),
  });
};

export const useCurrentPhotoGangBanger = () => {
  const { user } = useAuth();
  return useQuery({
    enabled: user !== null,
    queryKey: ["photoGangBangers", "me", user?.username],
    queryFn: () => PhotoGangBangerApi.getCurrent(),
  });
};

export const useUpdatePhotoGangBanger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoGangBanger: PhotoGangBangerPatchRequestDto) =>
      PhotoGangBangerApi.patch(photoGangBanger),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photoGangBangers"] });
    },
  });
};

export const useCreatePhotoGangBanger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoGangBanger: PhotoGangBangerCreateRequest) =>
      PhotoGangBangerApi.post(photoGangBanger),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photoGangBangers"] });
    },
  });
};

export const useReplacePhotoGangBangerPositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PhotoGangBangerPositionsPutRequestDto) =>
      PhotoGangBangerApi.putPositions(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photoGangBangers"] });
    },
  });
};

export const useUploadProfilePicture = () => {
  return useMutation({
    mutationFn: (file: File) => UserUploadApi.upload(file),
    onError: (error) => {
      toast.error("Kunne ikke laste opp profilbilde", {
        description: error instanceof Error ? error.message : "Ukjent feil",
      });
    },
  });
};
