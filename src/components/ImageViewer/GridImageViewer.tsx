import React, { useContext } from "react";
import styles from "./imageStyle.module.css";
import MotiveImage from "./MotiveImage";
import { PhotoDto } from "../../../generated";
import { createImgUrl } from "../../utils/createImgUrl/createImgUrl";
import { ImageContext } from "../../contexts/ImageContext";

interface GridImageViewerProps {
  photos: PhotoDto[];
}

const GridImageViewer = ({ photos }: GridImageViewerProps) => {
  const { setPhotos, setPhotoIndex, setIsOpen } = useContext(ImageContext);

  const updateIndex = (index: number) => {
    setPhotos(photos);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const imageItems = photos.map((image: PhotoDto, index: number) => {
    const key = `motive-image${index}`;
    return (
      <MotiveImage
        id={image.photoId.id}
        image={createImgUrl(image)}
        key={key}
        imageListProp={photos}
        index={index}
        updateIndex={() => updateIndex(index)}
        title={image.motive.title}
        date={image.motive.dateCreated}
      />
    );
  });

  return (
    <>
      <div className={styles.backgroundFlex}>
        <div className={styles.flex}>{imageItems}</div>
      </div>
    </>
  );
};

export default GridImageViewer;
