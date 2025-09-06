import React, { useContext, useEffect, useRef, useState } from "react";
import { PhotoDto } from "../../../generated/models/PhotoDto";
import { PhotoApi } from "../../utils/api/PhotoApi";
import { createImgUrl } from "../../utils/createImgUrl/createImgUrl";
import styles from "./Photos.module.css";
import { ImageContext } from "../../contexts/ImageContext";

export const Photos = () => {
  const PAGE_SIZE = 20;
  const BUFFER_PX = 300;

  const [goodPhotos, setGoodPhotos] = useState<PhotoDto[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { setPhotos, setPhotoIndex, setIsOpen } = useContext(ImageContext);

  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      try {
        const newPhotos = await PhotoApi.getGoodPhotos(
          String(page),
          String(PAGE_SIZE),
        );
        setGoodPhotos((prev) => [...prev, ...newPhotos]);
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

  useEffect(() => {
    // Make sure the loaderRef is pointing to a real DOM element before proceeding
    if (!loaderRef.current) return;

    const options = {
      root: null,
      // Pretend the viewport is BUFFER_PX bigger at the bottom. This makes it trigger early, before the user actually hits the bottom
      rootMargin: `${BUFFER_PX}px`,
      // Trigger the callback when 10% of the target is visible
      threshold: 0.1,
    };

    const handleObserver: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    // The IntersectionObserver watches loaderRef.current, and whenever that div scrolls into view, it triggers the handleObserver function
    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isLoading, hasMore]);

  const updateIndex = (index: number) => {
    setPhotos(goodPhotos);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <div>
      <div className={styles.photoContainer}>
        {goodPhotos.map((photo, index: number) => (
          <div
            key={photo.photoId.id}
            className={styles.photoItem}
            onClick={() => updateIndex(index)}
          >
            <img src={createImgUrl(photo)} />
          </div>
        ))}
      </div>

      {isLoading && <p>Laster inn flere bilder... 🤓</p>}
      {!hasMore && <p>Wow, du har lastet inn alle blinkskuddene våre! 📸 </p>}

      {/* Invisible "sentinel" at the bottom of the page that is essential for infinity loop to work */}
      <div ref={loaderRef} style={{ height: 1 }} />
    </div>
  );
};

export default Photos;
