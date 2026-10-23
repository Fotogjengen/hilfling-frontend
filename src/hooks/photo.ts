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
import {
  PhotoDto,
  PhotoGoodPictureToggleRequestDto,
  PhotoPatchRequestDto,
} from "../../generated";
import { PaginatedResultData } from "../utils/api/types";

export const usePhotosByMotiveId = (motiveId: string, enabled = true) => {
  return useQuery({
    queryKey: ["photos", "motive", motiveId],
    queryFn: () => PhotoApi.getAllByMotiveId(motiveId),
    enabled: !!motiveId && enabled,
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
      toast.success("Bildet ble slettet");
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

type BatchMessages = {
  progress: string;
  success: string;
  failure: string;
};

async function runBatchWithToast(
  tasks: (() => Promise<unknown>)[],
  messages: BatchMessages,
) {
  const total = tasks.length;
  const progressOptions = (done: number) => ({
    description: `${done} av ${total}`,
    value: (done / total) * 100,
  });
  const toastId = toast.progress(messages.progress, progressOptions(0));

  let done = 0;
  const results = await Promise.allSettled(
    tasks.map(async (task) => {
      try {
        await task();
      } finally {
        done += 1;
        toast.progress(messages.progress, {
          id: toastId,
          ...progressOptions(done),
        });
      }
    }),
  );

  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length === 0) {
    toast.success(messages.success, { id: toastId });
    return;
  }

  const reason: unknown = failures[0].reason;
  const failedCount = `${failures.length} av ${total} mislyktes`;
  toast.error(messages.failure, {
    id: toastId,
    description: `${failedCount}. Feilkode: ${reason instanceof Error ? reason.message : "Unknown error"}`,
  });
  throw reason;
}

function countMessage(count: number, one: string, many: string) {
  return count === 1 ? one : `${count} ${many}`;
}

export function pluralizePhotos(count: number) {
  return `${count} ${count === 1 ? "bilde" : "bilder"}`;
}

export function describePhotoChanges(
  changedCount: number,
  deletedCount: number,
  verbs: { changed: string; deleted: string },
) {
  const parts: string[] = [];
  if (changedCount > 0) {
    parts.push(`${verbs.changed} ${pluralizePhotos(changedCount)}`);
  }
  if (deletedCount > 0) {
    const object =
      parts.length > 0 ? String(deletedCount) : pluralizePhotos(deletedCount);
    parts.push(`${verbs.deleted} ${object}`);
  }
  const text = parts.join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type SavePhotoChangesRequest = {
  photoPatches: { photoId: string; patch: PhotoPatchRequestDto }[];
  deletedPhotoIds: string[];
};

export const useSavePhotoChanges = (motiveId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ photoPatches, deletedPhotoIds }: SavePhotoChangesRequest) =>
      runBatchWithToast(
        [
          ...photoPatches.map(
            ({ photoId, patch }) =>
              () =>
                PhotoApi.patch(photoId, patch),
          ),
          ...deletedPhotoIds.map((photoId) => () => PhotoApi.delete(photoId)),
        ],
        {
          progress: `${describePhotoChanges(photoPatches.length, deletedPhotoIds.length, { changed: "endrer", deleted: "sletter" })}…`,
          success: describePhotoChanges(
            photoPatches.length,
            deletedPhotoIds.length,
            { changed: "endret", deleted: "slettet" },
          ),
          failure: "Kunne ikke lagre alle endringene.",
        },
      ),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", motiveId],
      });
    },
  });
};

type MovePhotosRequest = {
  photoIds: string[];
  targetMotiveId: string;
};

export const useMovePhotos = (motiveId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ photoIds, targetMotiveId }: MovePhotosRequest) =>
      runBatchWithToast(
        photoIds.map((photoId) => () => PhotoApi.move(photoId, targetMotiveId)),
        {
          progress: "Flytter bilder…",
          success: countMessage(
            photoIds.length,
            "Ett bilde ble flyttet",
            "bilder ble flyttet",
          ),
          failure: "Kunne ikke flytte alle bildene.",
        },
      ),
    onSettled: (_, __, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", motiveId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["photos", "motive", variables.targetMotiveId],
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
