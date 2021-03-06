import React, { FC } from "react";
import { IResponseObject } from "./ShowMotive";

export interface IImageList {
  _id: number;
  image: string;
}

interface Props {
  id: number;
  image: string;
  imageListProp: IResponseObject[];
  index: number;
  updateIndex: (index: number) => void;
}

const MotiveImage: FC<Props> = ({ image, index, updateIndex }: Props) => {
  console.log(index);
  return (
    <>
      <div className="motiveImage" onClick={() => updateIndex(index)}>
        <img src={image} height="200px" width="300px" />
        <p>Test</p>
      </div>
    </>
  );
};

export default MotiveImage;
