import React, { useContext } from "react";
import styles from "./imageStyle.module.css";
import MotiveImage from "./MotiveImage";
import "react-image-lightbox/style.css";
import { PhotoDto } from "../../../generated";
import { createImgUrl } from "../../utils/createImgUrl/createImgUrl";
import { ImageContext } from "../../contexts/ImageContext";
import { useSearchContext } from "../../views/Search/SearchProvider";

interface GridImageViewerProps {
  photos: PhotoDto[];
}

const GridImageViewer = ({ photos } : GridImageViewerProps) => {
  const { setPhotos, setPhotoIndex, setIsOpen } = useContext(ImageContext);

  const searchContext = useSearchContext();
  const searchQuery = searchContext ? searchContext.searchQuery : "";
  

  

  const filteredPhotos = photos.filter((photo: PhotoDto) => searchQuery != "" ? (photo.motive.title.toLowerCase().includes(searchQuery.toLowerCase())) : photos); //Finn en bedre løsning etterhvert

  const updateIndex = (index: number) => {
    setPhotos(photos);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const imageItems = filteredPhotos.map((image: PhotoDto, index: number) => {
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

export default GridImageViewer;
