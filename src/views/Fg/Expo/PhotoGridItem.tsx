import React, { FC } from "react";

import { Box, Checkbox, Grid, Typography } from "@mui/material";

import { createImgUrl } from "../../../utils/createImgUrl/createImgUrl";
import { PhotoDto } from "../../../../generated";

interface Props {
  image: PhotoDto;
  index: number;
  isChecked: boolean[];
  updateIndex: (index: number) => void;
  handleCheckboxChange: (index: number) => void;
}

const PhotoGridItem: FC<Props> = ({
  image,
  index,
  isChecked,
  updateIndex,
  handleCheckboxChange,
}: Props) => {
  return (
    <Grid
      item
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: 4,
        margin: "0.5rem",
      }}
      xs={11.5}
      md={5.5}
      lg={3.5}
    >
      <Box onClick={() => updateIndex(index)} sx={{ position: "relative" }}>
        <img src={createImgUrl(image)} height="100%" width="100%" />
      </Box>

      <Box
        sx={{
          boxShadow: 1,
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingX: "0.5rem",
          bgcolor: "#f4f4f4",
        }}
      >
        <Typography>Velg for nedlastning</Typography>
        <Checkbox
          checked={isChecked[index] || false}
          onChange={() => handleCheckboxChange(index)}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Box>
    </Grid>
  );
};

export default PhotoGridItem;
