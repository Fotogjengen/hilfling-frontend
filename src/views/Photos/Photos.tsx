import React, { useContext, useEffect, useRef, useState } from "react";
import { PhotoDto } from "../../../generated/models/PhotoDto";
import { PhotoApi } from "../../utils/api/PhotoApi";
import { createImgUrl } from "../../utils/createImgUrl/createImgUrl";
import styles from "./Photos.module.css";
import { ImageContext } from "../../contexts/ImageContext";

type Tile =
  | {
      type: "photo";
      photo: PhotoDto;
      photoIndex: number;
      className: string;
    }
  | {
      type: "gap";
      key: string;
      className: string;
    };

export const Photos = () => {
  const PAGE_SIZE = 20;
  const BUFFER_PX = 300;

  const [goodPhotos, setGoodPhotos] = useState<PhotoDto[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { setPhotos, setPhotoIndex, setIsOpen } =
    useContext(ImageContext);



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



  const hash01 = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) | 0;
    }
    return (Math.abs(h) % 1000) / 1000; 
  };

  const buildTiles = (photos: PhotoDto[]): Tile[] => {
    const tiles: Tile[] = [];
    let i = 0;

    while (i < photos.length) {
      const seed = `${photos[i].photoId.id}:${i}`;

      const r = hash01(seed);

   
      if (r < 0.35 && i + 1 < photos.length) {
        const pattern = Math.floor(
          hash01(seed + ":p") * 3
        ); // 0,1,2

        const a = photos[i];
        const b = photos[i + 1];

        const A: Tile = {
          type: "photo",
          photo: a,
          photoIndex: i,
          className: styles.w4,
        };
        const B: Tile = {
          type: "photo",
          photo: b,
          photoIndex: i + 1,
          className: styles.w4,
        };
        const G: Tile = {
          type: "gap",
          key: `gap-${a.photoId.id}-${b.photoId.id}-${i}`,
          className: styles.gap,
        };

        if (pattern === 0) tiles.push(A, B, G); 
        if (pattern === 1) tiles.push(G, A, B); 
        if (pattern === 2) tiles.push(A, G, B); 

        i += 2;
        continue;
      }

  
      const p = photos[i];
      const r2 = hash01(
        `${p.photoId.id}:w:${i}`
      );


      const cls =
        r2 < 0.25 ? styles.w12 : styles.w6;

      tiles.push({
        type: "photo",
        photo: p,
        photoIndex: i,
        className: cls,
      });

      i += 1;
    }

    return tiles;
  };

  const tiles = buildTiles(goodPhotos);



  return (
    <div>
      <div className={styles.grid}>
        {tiles.map((t) => {
          if (t.type === "gap") {
            return (
              <div
                key={t.key}
                className={t.className}
                aria-hidden="true"
              />
            );
          }

          return (
            <div
              key={t.photo.photoId.id}
              className={`${styles.item} ${t.className}`}
              onClick={() => openAt(t.photoIndex)}
            >
              <img
                src={createImgUrl(t.photo)}
                loading="lazy"
                alt=""
              />
            </div>
          );
        })}
      </div>

      {isLoading && <p>Laster inn flere bilder... 🤓</p>}
      {!hasMore && (
        <p>Wow, du har lastet inn alle blinkskuddene våre! 📸</p>
      )}

      <div ref={loaderRef} style={{ height: 1 }} />
    </div>
  );
};

export default Photos;
