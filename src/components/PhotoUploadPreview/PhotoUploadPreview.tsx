import styles from "./PhotoUploadPreview.module.css";
import React, { FC, useState } from "react";
import { DragNDropFile } from "../../types";
import { FormControlLabel, FormGroup, Checkbox, Paper } from "@mui/material";

interface Props {
  file: DragNDropFile;
  handleChange: () => void;
}

const PhotoUploadPreview: FC<Props> = ({ file, handleChange }: Props) => {
  const fileSizeAsKb = Math.ceil(file.size / 1000);
  const [isGoodPicture, setIsGoodPicture] = useState<boolean>(
    file.isGoodPicture,
  );

  return (
    <Paper elevation={1}>
      <div className={styles.container}>
        <img
          width={100}
          height={100}
          src={URL.createObjectURL(file)}
          alt={file.name}
          className={styles.image}
        />
        <div>
          <div>{file.name}</div>
          <div>{fileSizeAsKb} kb</div>
          <div>{file.type}</div>

          <FormGroup>
            <FormControlLabel
              label="Oppslagsbilde"
              control={
                <Checkbox
                  checked={isGoodPicture}
                  onChange={() => {
                    handleChange();
                    setIsGoodPicture(file.isGoodPicture);
                  }}
                  name="Good picture"
                />
              }
            />
          </FormGroup>
        </div>
      </div>
    </Paper>
  );
};

export default PhotoUploadPreview;
