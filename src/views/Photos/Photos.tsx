import React, { useEffect, useRef, useState } from 'react';
import { PhotoDto } from '../../../generated/models/PhotoDto';
import { PhotoApi } from '../../utils/api/PhotoApi';
import { createImgUrl } from '../../utils/createImgUrl/createImgUrl';
import styles from "./Photos.module.css";

export const Photos: React.FC = () => {
  const PAGE_SIZE = 4;
  const BUFFER_PX = 300;

  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      try {
        const newPhotos = await PhotoApi.getGoodPhotos(
          String(page),
          String(PAGE_SIZE)
        );
        setPhotos((prev) => [...prev, ...newPhotos]);
        if (newPhotos.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasMore) {
      void loadPhotos();
    }
  }, [page, hasMore]);

  // Set up IntersectionObserver on the sentinel div
  useEffect(() => {
    if (!loaderRef.current) return;

    const options = {
      root: null, // viewport
      rootMargin: `${BUFFER_PX}px`,
      threshold: 0.1,
    };

    const handleObserver: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isLoading, hasMore]);

  return (
    <div>
      <div className={styles.photoContainer}>
        {photos.map((photo) => (
          <div key={photo.photoId.id} className={styles.photoItem}>
            <img
              src={createImgUrl(photo)}
              width={500}
            />
          </div>
        ))}
      </div>

      {isLoading && <p>Loading more photos…</p>}
      {!hasMore && <p>No more photos to load.</p>}

      {/* Scroll sentinel */}
      <div ref={loaderRef} style={{ height: 1 }} />
    </div>
  );
};

export default Photos;