import React, { useContext, useEffect, useState } from "react";

import { Box, Button, Grid, Paper, styled, Typography } from "@mui/material";

import { PhotoDto } from "../../../../generated";
import { PhotoApi } from "../../../utils/api/PhotoApi";

import { createImgUrl } from "../../../utils/createImgUrl/createImgUrl";
import "react-image-lightbox/style.css";
import FileSaver from "file-saver";
import JSZip from "jszip";

import PhotoGridItem from "./PhotoGridItem";
import { ImageContext } from "../../../contexts/ImageContext";

const Expo = () => {
  const [photoResponse, setPhotoResponse] = useState<PhotoDto[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  const { setPhotos, setPhotoIndex, setIsOpen } = useContext(ImageContext);

  useEffect(() => {
    setIsChecked(photoResponse.map(() => false));
  }, [photoResponse]);

  useEffect(() => {
    PhotoApi.getAll()
      .then((res) => setPhotoResponse(res))
      .catch((e) => console.log(e));

    console.log(photoResponse);
  }, []);

  const DownloadButton = styled(Paper)(({ theme }) => ({
    position: "fixed",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: "1vw",
    width: "60vw",
    left: "20vw",
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    fontSize: "large",
    cursor: "default",
  }));

  const [isChecked, setIsChecked] = useState<boolean[]>([]);

  const handleCheckboxChange = (index: number) => {
    const newIsChecked = [...isChecked];
    newIsChecked[index] = !isChecked[index];
    setIsChecked(newIsChecked);
    if (!isChecked[index]) {
      setSelectedCount(selectedCount + 1);
    } else {
      setSelectedCount(selectedCount - 1);
    }
  };

  const handleDownload = async () => {
    const selectedImages = photoResponse.filter(
      (image: PhotoDto, index: number) => isChecked[index],
    );
    const zip = new JSZip();
    const folder = zip.folder("images");

    await Promise.all(
      selectedImages.map((image) => {
        const imageUrl = createImgUrl(image);
        return fetch(imageUrl)
          .then((res) => res.blob())
          .then((imageData) => {
            const imageName = `${image.photoId.id}.jpg`;
            if (folder) {
              folder.file(imageName, imageData);
            }
          });
      }),
    );

    const blob = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(blob, "images.zip");

    setIsChecked(new Array(isChecked.length).fill(false));
    setSelectedCount(0);
  };

  const updateIndex = (index: number) => {
    setPhotos(photoResponse);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const imageItems = photoResponse.map((image: PhotoDto, index: number) => {
    const key = `is-good-picture-${index}`;
    return (
      <PhotoGridItem
        key={key}
        image={image}
        index={index}
        isChecked={isChecked}
        updateIndex={updateIndex}
        handleCheckboxChange={handleCheckboxChange}
      />
    );
  });

  return (
    <>
      <Box sx={{ bgcolor: "white" }}>
        <Typography
          sx={{
            margin: "auto",
            width: "90%",
            pb: "0.5rem",
            marginY: "0.5rem",
            textAlign: "center",
            fontSize: 28,
            borderBottom: "0.1rem solid black",
          }}
        >
          Expo
        </Typography>
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          {imageItems ? imageItems : <div>No images</div>}
        </Grid>
        <DownloadButton>
          <Typography
            sx={{
              padding: "0rem 1rem",
              textAlign: "center",
              fontSize: 28,
            }}
          >
            Valgt : {selectedCount}
          </Typography>
          <Button variant="contained" onClick={() => void handleDownload()}>
            Last ned
          </Button>
        </DownloadButton>
      </Box>
    </>
  );
};

export default Expo;
