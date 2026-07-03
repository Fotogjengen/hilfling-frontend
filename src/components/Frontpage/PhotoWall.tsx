import { useGoodPhotos } from "@/hooks/photo";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "./PhotoWall.module.css";
import { Spinner } from "../Icons/Spinner";
import { PhotoDto } from "@/../generated";
import PhotoMosaic from "../PhotoMosaic/PhotoMosaic";

type PhotoWallProps = {
  onPhotoPress?: (
    page: number,
    positionInPage: number,
    pictureId: string,
  ) => void;
};

export default function PhotoWall({ onPhotoPress }: PhotoWallProps) {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGoodPhotos();

  const photos = useMemo(
    () => data?.pages.flatMap((page) => page.currentList) ?? [],
    [data],
  );

  const photoPageMap = useMemo(() => {
    const map: Record<string, { page: number; positionInPage: number }> = {};
    data?.pages.forEach((page, pageIndex) => {
      page.currentList.forEach((photo, photoIndex) => {
        map[photo.photoId.id] = { page: pageIndex, positionInPage: photoIndex };
      });
    });
    return map;
  }, [data]);

  const handlePhotoPress = (photo: PhotoDto) => {
    const pos = photoPageMap[photo.photoId.id];
    if (!pos) return;
    onPhotoPress?.(pos.page, pos.positionInPage, photo.photoId.id);
  };

  // load the next page, but only once the current photos' images have loaded
  const [allMeasured, setAllMeasured] = useState(false);
  const { ref: sentinelRef, inView } = useInView({ rootMargin: "600px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && allMeasured)
      void fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, allMeasured, fetchNextPage]);

  return (
    <PhotoMosaic
      photos={photos}
      onPhotoPress={handlePhotoPress}
      isLoading={isPending}
      onAllMeasuredChange={setAllMeasured}
      footer={
        <>
          {isFetchingNextPage && (
            <div className={styles.spinner}>
              <Spinner />
            </div>
          )}
          <div ref={sentinelRef} />
        </>
      }
    />
  );
}
