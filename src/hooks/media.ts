import { MediaApi } from "@/utils/api/MediaApi";
import { useQuery } from "@tanstack/react-query";

export const useMedias = () => {
  return useQuery({
    queryKey: ["medias"],
    queryFn: () => MediaApi.getAll().then((res) => res.data.currentList),
  });
};
