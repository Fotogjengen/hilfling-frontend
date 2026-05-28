import { useState, useEffect } from "react";
import styles from "./Carousel.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PhotoDto } from "../../../../generated";
import { PhotoApi } from "../../../utils/api/PhotoApi";

const Carousel = () => {
  const [showArrows, setShowArrows] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slideGoRight, setSlideGoRight] = useState(true);

  const [carouselPhotos, setCarouselPhotos] = useState<PhotoDto[]>([]);

  const handleMouseEnter = () => {
    setShowArrows(true);
  };
  const handleMouseLeave = () => {
    setShowArrows(false);
  };

  const onArrowRightClick = () => {
    if (currentSlide >= carouselPhotos.length) {
      setCurrentSlide(1);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
    setSlideGoRight(true);
  };

  const onArrowLeftClick = () => {
    if (currentSlide <= 1) {
      setCurrentSlide(carouselPhotos.length);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
    setSlideGoRight(false);
  };

  useEffect(() => {
    if (slideGoRight) {
      const timer = setTimeout(() => onArrowRightClick(), 30000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onArrowLeftClick(), 30000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  useEffect(() => {
    void PhotoApi.getGoodPhotos()
      .then((res) => {
        setCarouselPhotos(res);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      {carouselPhotos.map((img, index) => (
        <img
          key={img.imageWeb}
          className={[
            styles.img,
            currentSlide - 1 === index ? styles.imgActive : null,
          ]
            .filter(Boolean)
            .join(" ")}
          src={img.imageWeb}
          alt={img.motive.title}
        />
      ))}
      {showArrows && (
        <div className={styles.arrows}>
          <button
            className={styles.arrowButton}
            onClick={() => onArrowLeftClick()}
            aria-label="Forrige bilde"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            className={styles.arrowButton}
            onClick={() => onArrowRightClick()}
            aria-label="Neste bilde"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
};
export default Carousel;
