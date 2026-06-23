import styles from "./PhotoUploadPreview.module.css";
import { useMemo } from "react";
import { DragNDropFile } from "../../types";
import { CheckboxField } from "../ui/input/Checkbox";

interface Props {
  file: DragNDropFile;
  isGoodPicture: boolean;
  handleChange: () => void;
}

const PhotoUploadPreview = ({ file, isGoodPicture, handleChange }: Props) => {
  const fileSizeAsKb = Math.ceil(file.size / 1000);
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <img
          width={100}
          height={100}
          src={objectUrl}
          alt={file.name}
          className={styles.image}
        />
        <div>
          <div>{file.name}</div>
          <div>{fileSizeAsKb} kb</div>
          <div>{file.type}</div>
          <CheckboxField
            label="Oppslagsbilde"
            checked={isGoodPicture}
            onCheckedChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadPreview;
