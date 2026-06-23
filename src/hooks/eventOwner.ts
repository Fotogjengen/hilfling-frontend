import { EventOwnerApi } from "@/utils/api/EventOwnerApi";
import { useQuery } from "@tanstack/react-query";

export const useEventOwners = () => {
  return useQuery({
    queryKey: ["eventOwners"],
    queryFn: () => EventOwnerApi.getAll().then((res) => res.data.currentList),
  });
};
