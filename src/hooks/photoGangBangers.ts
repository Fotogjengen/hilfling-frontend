import { PhotoGangBangerApi } from "@/utils/api/PhotoGangBangerApi";
import { useQuery } from "@tanstack/react-query";

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