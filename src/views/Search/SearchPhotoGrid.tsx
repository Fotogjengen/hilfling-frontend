import { PhotoDto, MotiveDto } from "../../../generated";
import React, { useState, useEffect } from "react";
import { PhotoApi } from "../../utils/api/PhotoApi";
import { MotiveApi } from "../../utils/api/MotiveApi";
import GridImageViewer from "../../components/ImageViewer/GridImageViewer";

const SearchPhotoGrid = () => {
  const [photoResponse, setPhotoResponse] = useState<PhotoDto[]>([]);
  const [, setMotiveResponse] = useState<MotiveDto>({} as MotiveDto);

  useEffect(() => {
    PhotoApi.getAll()
      .then((res) => {
        setPhotoResponse(res);
      })
      .catch((e) => console.log(e));
  }, []);
  useEffect(() => {
    MotiveApi.getAll()
      .then((res) => {
        const motives = res.data.currentList[0];
        setMotiveResponse(motives);
      })
      .catch((e) => console.log(e));
  }, []);

  return <GridImageViewer photos={photoResponse} />;
};

export default SearchPhotoGrid;
