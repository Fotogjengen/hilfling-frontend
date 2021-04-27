import styles from "./PhotoUploadPreview.module.css";
import React, { FC } from "react";
import { DragNDropFile } from "../../types";
import {
  FormControlLabel,
  FormGroup,
  Checkbox,
  Paper,
} from "@material-ui/core";

interface Props {
  file: DragNDropFile;
  handleChange: () => void;
}

const PhotoUploadPreview: FC<Props> = ({ file, handleChange }: Props) => {
  const fileSizeAsKb = Math.ceil(file.size / 1000);

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
        <div className={styles.metaContainer}>
          <div>{file.name}</div>
          <div>{fileSizeAsKb} kb</div>
          <div>{file.type}</div>

          <FormGroup>
            <FormControlLabel
              label="Bra bilde"
              control={
                <Checkbox
                  checked={file.isGoodPicture}
                  onChange={handleChange}
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
