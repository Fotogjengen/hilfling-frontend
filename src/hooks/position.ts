import { PositionApi } from "@/utils/api/PositionApi";
import { toast } from "@/components/ui/overlay/Toaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Permission, PositionPatchRequestDto } from "../../generated";
import type { PositionCreateRequest } from "@/utils/api/PositionApi";

export const usePositions = () => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => PositionApi.getAll().then((res) => res.data.currentList),
  });
};

export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (positionId: string) => PositionApi.deleteById(positionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast.success("Vervet ble slettet.");
    },
    onError: (error) => {
      toast.error("Kunne ikke slette vervet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (position: PositionPatchRequestDto) =>
      PositionApi.patch(position),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast.success("Vervet ble oppdatert.");
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere vervet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const usePositionPermissions = (positionId: string) => {
  return useQuery({
    queryKey: ["positions", positionId, "permissions"],
    queryFn: () => PositionApi.getPermissions(positionId),
  });
};

export const useUpdatePositionPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      positionId,
      permissions,
    }: {
      positionId: string;
      permissions: Permission[];
    }) => PositionApi.putPermissions(positionId, permissions),
    onSuccess: (_, { positionId }) => {
      void queryClient.invalidateQueries({
        queryKey: ["positions", positionId, "permissions"],
      });
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere tilgangene.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const usePostPosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (position: PositionCreateRequest) => PositionApi.post(position),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast.success("Vervet ble opprettet.");
    },
    onError: (error) => {
      toast.error("Kunne ikke opprette vervet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};
