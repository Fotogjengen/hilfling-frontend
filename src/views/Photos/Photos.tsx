import React, { useEffect, useState } from 'react';
import { PhotoDto } from '../../../generated/models/PhotoDto';
import { PhotoApi } from '../../utils/api/PhotoApi';
import { createImgUrl } from '../../utils/createImgUrl/createImgUrl';
import styles from "./Photos.module.css";


const Photos = () => {
  const pageSize = 10; 
  const [photos, setPhotos] = useState<PhotoDto[]>([]);

  useEffect(() => {
    PhotoApi.getGoodPhotos("0","10")
      .then((res) => {
        setPhotos(res);
      })
      .catch((err) => console.log(err));
    }, []);


  return (
    <div>
      <div className = {styles.photoContainer}>
        {photos.map((photo) => (
          <div key={String(photo.photoId)} className = {styles.photoItem}>
          <img 
            src={createImgUrl(photo) } 
            width="500px"
          />
        </div>
      
        ))}
      </div>
    </div>
  );
};

export default Photos;