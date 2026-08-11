import { PhotoApi, PhotoUploadRequest } from "@/utils/api/PhotoApi";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/overlay/Toaster";
import { useMemo } from "react";
import { AxiosProgressEvent } from "axios";
import { PhotoDto, PhotoGoodPictureToggleRequestDto } from "../../generated";
import { PaginatedResultData } from "../utils/api/types";

export const usePhotosByMotiveId = (motiveId: string) => {
  return useQuery({
    queryKey: ["photos", "motive", motiveId],
    queryFn: () => PhotoApi.getAllByMotiveId(motiveId),
    enabled: !!motiveId,
  });
};

export const useUploadPhoto = (
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PhotoUploadRequest) =>
      PhotoApi.upload(request, onUploadProgress),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", variables.motiveId],
      });
    },
    onError: (error) => {
      toast.error("Kunne ikke laste opp bildet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useUpdateGoodPicture = (motiveId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PhotoGoodPictureToggleRequestDto) =>
      PhotoApi.updateGoodPicture(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", motiveId],
      });
    },
    onError: (error) => {
      toast.error("Kunne ikke oppdatere bildet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useDeletePhoto = (motiveId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => PhotoApi.delete(photoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", motiveId],
      });
    },
    onError: (error) => {
      toast.error("Kunne ikke slette bildet.", {
        description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    },
  });
};

export const useGoodPhotosByMotiveId = (motiveId: string) => {
  return useQuery({
    queryKey: ["photos", "motive", motiveId, "good"],
    queryFn: () => PhotoApi.getAllGoodByMotiveId(motiveId),
    enabled: !!motiveId,
  });
};

export const GOOD_PHOTOS_PAGE_SIZE = 24;

export const useGoodPhotos = () => {
  return useInfiniteQuery({
    queryKey: ["photos", "good"],
    queryFn: ({ pageParam }) =>
      PhotoApi.getGoodPhotos(pageParam, GOOD_PHOTOS_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length < lastPage.totalPages ? allPages.length : undefined,
  });
};

/** `useGoodPhotosFromPage` with the loaded pages flattened to a single list. */
export const useFlatGoodPhotos = (startPage: number) => {
  const query = useGoodPhotosFromPage(startPage);
  const photos = useMemo(
    () => query.data?.pages.flatMap((page) => page.currentList) ?? [],
    [query.data],
  );
  return { ...query, photos };
};

// infinite query used in the photo modal for pagination interop
export const useInfiniteMotivePhotos = (motiveId: string) => {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: ["photos", "motive", motiveId, "infinite"],
    queryFn: () => PhotoApi.getAllByMotiveId(motiveId),
    initialPageParam: 0,
    getNextPageParam: () => undefined,
    getPreviousPageParam: () => undefined,
    enabled: !!motiveId,
    initialData: () => {
      const flat = queryClient.getQueryData<PhotoDto[]>([
        "photos",
        "motive",
        motiveId,
      ]);
      return flat ? { pages: [flat], pageParams: [0] } : undefined;
    },
  });
  const photos = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
  return { ...query, photos };
};

export type GoodPhotoPlacement = { page: number; positionInPage: number };

/**
 * Resolves where a good photo actually lives in the paginated feed.
 */
export const useGoodPhotoPlacement = (
  pictureId: string,
  likelyAt: GoodPhotoPlacement,
) => {
  const queryClient = useQueryClient();

  const localPlacement = useMemo<GoodPhotoPlacement | undefined>(() => {
    const feed = queryClient.getQueryData<
      InfiniteData<PaginatedResultData<PhotoDto>, number>
    >(["photos", "good"]);
    const photo = feed?.pages.find((page) => page.page === likelyAt.page)
      ?.currentList[likelyAt.positionInPage];
    return photo?.photoId.id === pictureId ? likelyAt : undefined;
  }, [queryClient, pictureId, likelyAt]);

  const {
    data: fetchedPlacement,
    isPending,
    error,
  } = useQuery({
    queryKey: ["photos", "good", "position", pictureId],
    queryFn: () =>
      PhotoApi.getGoodPhotoPosition(pictureId, GOOD_PHOTOS_PAGE_SIZE),
    enabled: !localPlacement,
  });

  if (localPlacement) {
    return { placement: localPlacement, isPending: false };
  }

  return {
    placement: fetchedPlacement
      ? {
          page: fetchedPlacement.page,
          positionInPage: fetchedPlacement.positionInPage,
        }
      : undefined,
    isPending,
    error,
  };
};

export const useGoodPhotosFromPage = (startPage: number) => {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["photos", "good", "page", startPage],
    queryFn: ({ pageParam }) =>
      PhotoApi.getGoodPhotos(pageParam, GOOD_PHOTOS_PAGE_SIZE),
    initialPageParam: startPage,
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 0 ? firstPage.page - 1 : undefined,
    initialData: () => {
      const feed = queryClient.getQueryData<
        InfiniteData<PaginatedResultData<PhotoDto>, number>
      >(["photos", "good"]);
      return feed && feed.pages.length > startPage ? feed : undefined;
    },
  });
};
