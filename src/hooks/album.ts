import { AlbumApi } from "@/utils/api/AlbumApi";
import { useQuery } from "@tanstack/react-query";

export const useAlbums = () => {
  return useQuery({
    queryKey: ["albums"],
    queryFn: () => AlbumApi.getAll().then((res) => res.data.currentList),
  });
};
