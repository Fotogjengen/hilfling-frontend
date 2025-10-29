import { PhotoDto } from "../../../generated";

export const createImgUrl = (photo: PhotoDto): string => {
  return `${photo?.largeUrl ? photo.largeUrl : ""}`;
  //Uncomment this when we are starting to use real file storage
  //return `http://localhost:8383/img/FG/${photo.motive?.motiveId.id}/${photo?.largeUrl}`;
};
