import { AlbumApi } from "@/utils/api/AlbumApi";
// import { useQuery } from "@tanstack/react-query";
// import { useInfiniteQuery } from "@tanstack/react-query";

import { AlbumPatchRequestDto } from "../../generated";
import { toast } from "@/components/ui/overlay/Toaster";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAlbums = () => {
  return useQuery({
    queryKey: ["albums"],
    queryFn: () => AlbumApi.getAll().then((res) => res.data.currentList),
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (albumId: string) => AlbumApi.deleteById(albumId),
    onSuccess: (_,albumId) => {
      void queryClient.invalidateQueries({
        queryKey: ["albums"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["album", albumId],
      });
      toast.success("Albumet ble slettet.")
    },
    onError: (error) => {
      toast.error("Kunne ikke slette album.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (album: AlbumPatchRequestDto) => AlbumApi.patch(album),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast.success("Albumet ble oppdatert.")
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere albumet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

// export const useInfiniteSCrollAlbums = () => {
//   return useInfiniteQuery({
//     queryKey: ["albums"],
//     initialPageParam: 0,

    
//     queryFn: async ({ pageParam }) => {
//       const res = await AlbumApi.getAll({
//         page: pageParam,
//       });

//       return res.data;
//     },

//     getNextPageParam: (lastPage, allPages) => {
//       const nextPage = allPages.length;

//       if (nextPage >= lastPage.totalPages) {
//         return undefined;
//       }

//       return nextPage;
//     },
//   });
// };