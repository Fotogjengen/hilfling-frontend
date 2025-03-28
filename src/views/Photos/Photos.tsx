import React, { useEffect, useState } from 'react';
import { PhotoDto } from '../../../generated/models/PhotoDto';
import { PhotoApi } from '../../utils/api/PhotoApi';
import { createImgUrl } from '../../utils/createImgUrl/createImgUrl';
import styles from "./Photos.module.css";
import { debounce } from "lodash"

const Photos = () => {
  const pageSize = 4;
  const buffer = 300;
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // You can use this if your API gives total count

  // Fetch photos when page changes
  useEffect(() => {
    const fetchPhotos = debounce(async () => {
      if (!hasMore) return;

      setIsLoading(true);
      try {
        const newPhotos = await PhotoApi.getGoodPhotos(String(page), String(pageSize));
        setPhotos((prev) => [...prev, ...newPhotos]);

        // If returned less than pageSize, assume no more to load
        if (newPhotos.length < pageSize) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching photos:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);
    void fetchPhotos();
  }, [page]);

  // Scroll listener with debounce
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + document.documentElement.scrollTop + buffer >=
        document.documentElement.offsetHeight;

      if (nearBottom && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore]);

  return (
    <div>
      <div className={styles.photoContainer}>
        {photos.map((photo) => (
          <div key={String(photo.photoId)} className={styles.photoItem}>
            <img src={createImgUrl(photo)} width="500px" />
          </div>
        ))}
      </div>

      {isLoading && <p>Loading more photos...</p>}
      {!hasMore && <p>No more photos to load.</p>}
    </div>
  );
};
export default Photos;