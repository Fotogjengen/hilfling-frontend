import React, { FC, useContext } from "react";
import styles from "./imageStyle.module.css";
import MotiveImage from "./MotiveImage";
import "react-image-lightbox/style.css";
import { PhotoDto } from "../../../generated";
import { createImgUrl } from "../../utils/createImgUrl/createImgUrl";
import { ImageContext } from "../../contexts/ImageContext";

interface Props {
  photos: PhotoDto[];
}

const ShowMotive: FC<Props> = ({ photos }) => {
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
      />
    );
  });

  return (
    <>
      <div className={styles.backgroundFlex}>
        
          <div className={styles.flex}>
            {imageItems}
            {/*TODO: remove filling elements, this is a temp fix! This fix ensures that the first image in a row always is at the far left. FInd a better method for doing this  */}
            
          </div>
       
      </div>
    </>
  );
};

export default ShowMotive;
