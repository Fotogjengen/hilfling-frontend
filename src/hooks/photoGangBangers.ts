import {
  PhotoGangBangerApi,
  type PhotoGangBangerCreateRequest,
} from "@/utils/api/PhotoGangBangerApi";
import type { PhotoGangBangerDto } from "@/../generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useUpdatePhotoGangBanger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoGangBanger: PhotoGangBangerDto) =>
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
