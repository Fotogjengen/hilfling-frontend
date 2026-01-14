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
    const load = async () => {
      setIsLoading(true);
      try {
        const batch = await PhotoApi.getGoodPhotos(
          String(page),
          String(PAGE_SIZE)
        );
        setGoodPhotos((prev) => [...prev, ...batch]);
        if (batch.length < PAGE_SIZE) setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasMore) void load();
  }, [page, hasMore]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !isLoading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: `${BUFFER_PX}px`, threshold: 0.1 }
    );

    ob.observe(loaderRef.current);
    return () => ob.disconnect();
  }, [isLoading, hasMore]);

  const openAt = (idx: number) => {
    setPhotos(goodPhotos);
    setPhotoIndex(idx);
    setIsOpen(true);
  };

  // Breddefordeling: mange 2-kolonne og en del helrad
  const widthClass = (p: PhotoDto, i: number) => {
    const id = p.photoId.id.toString();
    let h = 0;
    for (let k = 0; k < id.length; k++) h = (h * 31 + id.charCodeAt(k)) | 0;

    const r = Math.abs(h + i) % 100; 
    if (r < 25) return styles.w12; 
    return styles.w6; 
  };

  return (
    <div>
      <div className={styles.grid}>
        {goodPhotos.map((photo, idx) => (
          <div
            key={photo.photoId.id}
            className={`${styles.item} ${widthClass(photo, idx)}`}
            onClick={() => openAt(idx)}
          >
            <img src={createImgUrl(photo)} loading="lazy" alt="" />
          </div>
        ))}
      </div>

      {isLoading && <p>Laster inn flere bilder... 🤓</p>}
      {!hasMore && <p>Wow, du har lastet inn alle blinkskuddene våre! 📸</p>}

      <div ref={loaderRef} style={{ height: 1 }} />
    </div>
  );
};

export default Photos;
