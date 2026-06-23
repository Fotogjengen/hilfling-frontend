import { PhotoDto } from "../../../generated";

export const createImgUrl = (photo: PhotoDto): string => {
  return `${photo?.imageProd ? photo.imageProd : ""}`;
  //Uncomment this when we are starting to use real file storage
  //return `http://localhost:8383/img/FG/${photo.motive?.motiveId.id}/${photo?.imageProd}`;
};
