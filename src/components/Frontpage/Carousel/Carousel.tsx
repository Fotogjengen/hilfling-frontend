import React, { FC, useState, useEffect } from "react";
import styles from "./Carousel.module.css";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import { PhotoDto } from "../../../../generated";
import { PhotoApi } from "../../../utils/api/PhotoApi";

const Carousel: FC = () => {
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
    PhotoApi.getGoodPhotos()
      .then((res) => {
        setCarouselPhotos(res);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div
        className={styles.container}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        {carouselPhotos.map((img, index) => {
          return (
            <img
              key={index}
              className={styles.img}
              style={{
                opacity: currentSlide - 1 == index ? "1" : "0",
                transition: "opacity 1.5s ease-out",
              }}
              src={img.mediumUrl}
              alt={img.motive.title}
            />
          );
        })}
        {showArrows ? (
          <div className={styles.arrows}>
            <ArrowBackIosNewRoundedIcon
              style={{ fontSize: 40 }}
              onClick={() => onArrowLeftClick()}
            />
            <ArrowForwardIosRoundedIcon
              style={{ fontSize: 40 }}
              onClick={() => onArrowRightClick()}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};
export default Carousel;
