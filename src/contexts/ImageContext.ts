import { createContext, Dispatch, SetStateAction } from "react";
import { PhotoDto } from "../../generated";

interface IImageContext {
  isOpen: boolean;
  photoIndex: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPhotoIndex: Dispatch<SetStateAction<number>>;
  photos: PhotoDto[];
  setPhotos: Dispatch<SetStateAction<Array<PhotoDto>>>;
}

const defaultState = {} as IImageContext;

export const ImageContext = createContext<IImageContext>(defaultState);
