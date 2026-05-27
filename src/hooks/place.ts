import { PlaceApi } from "@/utils/api/PlaceApi";
import { useQuery } from "@tanstack/react-query";

export const usePlaces = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: () => PlaceApi.getAll().then((res) => res.data.currentList),
  });
};
