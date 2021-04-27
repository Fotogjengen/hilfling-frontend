import React, { FC, useEffect, useState } from "react";
import { ValidationErrors } from "final-form";
import { Grid } from "@material-ui/core";
import PhotoUploadForm from "../../../forms/PhotoUploadForm";
import { useDropzone } from "react-dropzone";
import cx from "classnames";
import styles from "./PhotoUpload.module.css";
import PhotoUploadPreview from "../../../components/PhotoUploadPreview/PhotoUploadPreview";
import { DragNDropFile } from "../../../types";

interface Values {
  album: string;
  date: Date;
  motive: string;
  tags: string[];
  category: string;
  place: string;
  securityLevel: string;
}

const PhotoUpload: FC = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".jpg,.jpeg,.png",
  });
  const [files, setFiles] = useState<DragNDropFile[]>([]);
  useEffect(() => {
    setFiles(acceptedFiles as DragNDropFile[]);
  }, [acceptedFiles]);

  const handleGoodPictureChange = (index: number) => {
    const newFiles: DragNDropFile[] = files;
    newFiles[index].isGoodPicture = !newFiles[index].isGoodPicture;
    setFiles(newFiles);
  };

  const renderFilePreview = files.map((file: DragNDropFile, index: number) => (
    <li className={styles.fileList} key={file.path}>
      <PhotoUploadPreview
        file={file}
        handleChange={() => handleGoodPictureChange(index)}
      />
    </li>
  ));

  const onSubmit = (values: Record<string, unknown>) => {
    // TODO: Send to backend
    console.log("submit", values);
    files.forEach((file) => {
      console.log(file);
    });
  };
  const validate = (values: Record<string, unknown>): ValidationErrors => {
    // TODO: Do validation
    console.log("validate", values);
    const errors: ValidationErrors = {};
    return errors;
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <PhotoUploadForm onSubmit={onSubmit} validate={validate} />
        </Grid>
        <Grid item xs={6}>
          <section>
            <div
              {...getRootProps({ className: "dropzone" })}
              className={cx(styles.dropzone)}
            >
              <input {...getInputProps()} />
              <p>Dra og slipp filer her, eller klikk for å velge filer.</p>
            </div>
            <aside>
              <ul className={styles.noStyleUl}>{renderFilePreview}</ul>
            </aside>
          </section>
        </Grid>
      </Grid>
    </div>
  );
};

export default PhotoUpload;
