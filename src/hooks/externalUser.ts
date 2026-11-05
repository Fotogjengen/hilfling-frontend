import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/overlay/Toaster";
import { ExternalUserApi } from "@/utils/api/ExternalUserApi";
import type { ExternalUserCreateRequest } from "@/utils/api/ExternalUserApi";
import { ExternalUserPatchRequestDto } from "../../generated";

const queryKey = ["externalUsers"];

const errorDescription = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 409
    ? "Brukernavnet er allerede tatt."
    : `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`;

export const useExternalUsers = () => {
  return useQuery({
    queryKey,
    queryFn: () => ExternalUserApi.getAll().then((res) => res.data.currentList),
  });
};

export const useCreateExternalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: ExternalUserCreateRequest) => ExternalUserApi.post(user),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      toast.success("Brukeren ble opprettet.");
    },
    onError: (error) => {
      toast.error("Kunne ikke opprette brukeren.", {
        description: errorDescription(error),
      });
    },
  });
};

export const useUpdateExternalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: ExternalUserPatchRequestDto) =>
      ExternalUserApi.patch(user),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      toast.success("Brukeren ble oppdatert.");
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere brukeren.", {
        description: errorDescription(error),
      });
    },
  });
};

export const useDeleteExternalUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ExternalUserApi.deleteById(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      toast.success("Brukeren ble slettet.");
    },
    onError: (error) => {
      toast.error("Kunne ikke slette brukeren.", {
        description: errorDescription(error),
      });
    },
  });
};

export const useResetExternalUserPassword = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      ExternalUserApi.resetPassword(id, { password }),
    onSuccess: () => {
      toast.success("Passordet ble endret.");
    },
    onError: (error) => {
      toast.error("Kunne ikke endre passordet.", {
        description: errorDescription(error),
      });
    },
  });
};
