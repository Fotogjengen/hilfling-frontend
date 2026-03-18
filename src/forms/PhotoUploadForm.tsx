import React, { FC, useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import DatePickerField from "../components/Form/DatePicker";
import Select from "../components/Form/Select";
// import ChipField from "../components/Form/ChipField";
import TextField from "../components/Form/TextField";
import Form from "../components/Form/Form";
import { Errors, Validate } from "../components/Form/types";
import { DragNDropFile } from "../types";
import cx from "classnames";
import styles from "../views/Fg/PhotoUpload/PhotoUpload.module.css";
import { useDropzone } from "react-dropzone";
import PhotoUploadPreview from "../components/PhotoUploadPreview/PhotoUploadPreview";
import { CategoryApi } from "../utils/api/CategoryApi";
import {
  AlbumDto,
  CategoryDto,
  EventOwnerDto,
  PlaceDto,
  SecurityLevelDto,
  MotiveDto,
} from "../../generated";
import { MotiveApi } from "../utils/api/MotiveApi";

import { PlaceApi } from "../utils/api/PlaceApi";
import { SecurityLevelApi } from "../utils/api/SecurityLevelApi";
import { AlbumApi } from "../utils/api/AlbumApi";
import { PhotoApi } from "../utils/api/PhotoApi";
import { EventOwnerApi } from "../utils/api/EventOwnerApi";
import { AlertContext, severityEnum } from "../contexts/AlertContext";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, nbNO } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AxiosProgressEvent } from "axios";


export interface PhotoUploadFormIV {
  album: string;
  dateCreated?: Date;
  motive: string;
  tags: string[];
  category: string;
  place: string;
  securityLevel: string;
  eventOwner: string;
}

interface Props {
  initialValues: PhotoUploadFormIV;
  mode?: "create" | "edit";
  photoId?: string;
  photoUrl?: string | null;
}

const PhotoUploadForm: FC<Props> = ({
  initialValues,
  mode = "create",
  photoId,
  photoUrl: initialPhotoUrl,
}) => {

const [formValues, setFormValues] = useState(initialValues);

  //Handling file Uploads with dropzone
const dropzone = useDropzone({
  accept: ".jpg,.jpeg,.png",
  disabled: mode === "edit",
});




const { acceptedFiles, getRootProps, getInputProps } = dropzone;

  const [files, setFiles] = useState<DragNDropFile[]>([]); // stores the uploaded files
  const [albums, setAlbums] = useState<AlbumDto[]>([]); // stores api fetch data from dropdowns
  const [categories, setCategories] = useState<CategoryDto[]>([]); // stores api fetch data from dropdowns
  const [eventOwners, setEventOwners] = useState<EventOwnerDto[]>([]); // stores api fetch data from dropdowns
  const [places, setPlaces] = useState<PlaceDto[]>([]); // stores api fetch data from dropdowns
  const [securityLevels, setSecurityLevels] = useState<SecurityLevelDto[]>([]); // stores api fetch data from dropdowns
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [motives, setMotives] = useState<MotiveDto[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl ?? null);

  const [isLoading, setIsLoading] = useState(false); // Track if a file is being uploaded
  const [progress, setProgress] = useState(0); // Tracks upload progress percentage'
  const [success, setSuccess] = useState(false);


  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  // Fetching data from apis:
  // If api fails, then a error message will be sent as an error alert

  useEffect(() => {
    AlbumApi.getAll()
      .then((res) => setAlbums(res.data.currentList))
      .catch((err) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(err.message);
      });

    CategoryApi.getAll()
      .then((res) => setCategories(res.data.currentList))
      .catch((err) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(err.message);
      });

    EventOwnerApi.getAll()
      .then((res) => setEventOwners(res.data.currentList))
      .catch((err) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(err.message);
      });

    PlaceApi.getAll()
      .then((res) => setPlaces(res.data.currentList))
      .catch((err) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(err.message);
      });

    MotiveApi.getAll()
      .then((res) => setMotives(res.data.currentList))
      .catch((err) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(err.message);
      });

    SecurityLevelApi.getAll()
      .then((res) => setSecurityLevels(res.data.currentList))
      .catch((err) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(err.message);
      });
  }, []);


  useEffect(() => {
  if (mode === "edit") return;

  setFiles((prevFiles) => [
    ...prevFiles,
    ...(acceptedFiles as DragNDropFile[]).map((file) => {
      file.isGoodPicture = false;
      return file;
    }),
  ]);
}, [acceptedFiles, mode]);

const onSubmit = async (values: Record<string, any>): Promise<boolean> => {
  setFormSubmitted(false);

  if (mode === "create" && files.length === 0) {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage("Du må laste opp minst én fil");
    return false;
  }

  try {
    setIsLoading(true);
    setSuccess(false);

    const handleUploadProgress = (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setProgress(percentCompleted);
      } else {
        setProgress(0);
      }
    };

    if (mode === "create") {
      const formattedDateCreated = values["dateCreated"]
        ? new Date(values["dateCreated"]).toISOString().split("T")[0]
        : "";

      const formData = new FormData();
      formData.append("motiveTitle", values["motive"]);
      formData.append("securityLevelId", values["securityLevel"]);
      formData.append("placeName", values["place"]);
      formData.append("albumId", values["album"]);
      formData.append("categoryName", values["category"]);
      formData.append("eventOwnerName", values["eventOwner"]);
      formData.append("dateCreated", formattedDateCreated);
      formData.append(
        "photoGangBangerId",
        "6a89444f-25f6-44d9-8a73-94587d72b839",
      );
      formData.append("tagList", values["tags"]);

      files.forEach((dragNDropFile, index) => {
        formData.append(
          "isGoodPhotoList",
          JSON.stringify(dragNDropFile.isGoodPicture),
        );
        formData.append("photoFileList", acceptedFiles[index]);
      });

      await PhotoApi.batchUpload(formData, handleUploadProgress);
      setFiles([]);
      
      setMessage("Photos uploaded successfully!");
    } else {
      if (!photoId) {
        throw new Error("Missing photoId in edit mode");
      }

      const selectedMotive = motives.find(
        (motive) => motive.motiveId?.id === values["motive"],
      );

      const selectedSecurityLevel = securityLevels.find(
        (securityLevel) =>
          securityLevel.securityLevelId?.id === values["securityLevel"],
      );

      if (!selectedMotive) {
        throw new Error("Fant ikke valgt motiv");
      }

      if (!selectedSecurityLevel) {
        throw new Error("Fant ikke valgt sikkerhetsnivå");
      }

      await PhotoApi.patch({
        photoId: { id: photoId },
        isGoodPicture: null,
        motive: selectedMotive,
        placeDto: null,
        securityLevel: selectedSecurityLevel,
        gang: null,
        albumDto: null,
        categoryDto: null,
        photoGangBangerDto: null,
        photoTags: null,
        dateCreated: new Date().toISOString().split("T")[0],
      });



      setFormValues((prev) => ({
        ...prev,
        motive: values["motive"],
        securityLevel: values["securityLevel"],
      }));

      setMessage("Photo updated successfully!");
      
    }

    setOpen(true);
    setSeverity(severityEnum.SUCCESS);
    setSuccess(true);
    setFormSubmitted(true);

    return true;
  } catch (error: any) {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage(error?.response?.data?.message || error?.message || "Upload failed");
    setSuccess(false);
    return false;
  } finally {
    setIsLoading(false);
  }
};

const validate: Validate = (values: any): Errors => {
  if (formSubmitted) return {};

  const errors: Errors = {};

  if (mode !== "edit") {
    if (!values.album) {
      errors.album = "Album er påkrevd";
    }

    if (!values.dateCreated) {
      errors.dateCreated = "Dato er påkrevd";
    } else {
      const selectedDate = new Date(values.dateCreated);
      const today = new Date();

      if (isNaN(selectedDate.getTime())) {
        errors.dateCreated = "Ugyldig dato";
      } else if (selectedDate > today) {
        errors.dateCreated = "Dato kan ikke være i fremtiden";
      }
    }

    if (!values.category) {
      errors.category = "Kategori er påkrevd";
    }

    if (!values.place) {
      errors.place = "Sted er påkrevd";
    }

    if (!values.eventOwner) {
      errors.eventOwner = "Eier er påkrevd";
    }
  }

  if (!values.motive) {
    errors.motive = "Motiv er påkrevd";
  }

  if (!values.securityLevel) {
    errors.securityLevel = "Sikkerhetsnivå er påkrevd";
  }

  return errors;
};

  const handleGoodPictureChange = (index: number) => {
    const newFiles: DragNDropFile[] = files;
    newFiles[index].isGoodPicture = !newFiles[index].isGoodPicture;
    setFiles(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const renderFilePreview = files.map((file: DragNDropFile, index: number) => (
    <li className={styles.fileList} key={index}>
      <div style={{ position: "relative" }}>
        <PhotoUploadPreview
          file={file}
          handleChange={() => handleGoodPictureChange(index)}
        />
        <button
          type="button"
          
          onClick={() => handleRemoveFile(index)}
        
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            background: "rgba(255, 255, 255, 0.7)",
            border: "1px solid #ccc",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ×
        </button>
      </div>
    </li>
  ));

  const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 40,
    borderRadius: 5,
  }));

  return (

    <Form
      key={`${photoId ?? "create"}-${formValues.motive}-${formValues.securityLevel}`}
      initialValues={formValues}
      validate={validate}
      onSubmit={onSubmit}
    >
    <div>
<Grid container spacing={2}>

  {mode !== "edit" && (
    <Grid item xs={12}>
      <Select
        name="album"
        label="Album"
        fullWidth
        required
      >
        {albums.map((album, index) => (
          <MenuItem key={`album-item-${index}`} value={album?.albumId?.id}>
            {album.title}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  )}

  {mode !== "edit" && (
    <Grid item xs={12}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={"NO"}
        localeText={
          nbNO.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <DatePickerField
          name="dateCreated"
          label="Dato create"
          required
          fullWidth
        />
      </LocalizationProvider>
    </Grid>
  )}

  <Grid item xs={12}>
    <Select name="motive" label="Motiv" fullWidth required>
      {motives.map((motive, index) => (
        <MenuItem key={`motive-item-${index}`} value={motive.motiveId?.id}>
          {motive.title}
        </MenuItem>
      ))}
    </Select>
  </Grid>

  {mode !== "edit" && (
    <Grid item xs={12}>
      <Select name="category" label="Kategori" fullWidth required>
        {categories.map((category, index) => (
          <MenuItem
            key={`category-item-${index}`}
            value={category.name}
          >
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  )}

  {mode !== "edit" && (
    <Grid item xs={12}>
      <Select name="place" label="Sted" fullWidth required>
        {places.map((place, index) => (
          <MenuItem key={`place-item-${index}`} value={place.name}>
            {place.name}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  )}

  
  {mode !== "edit" && (
  <Grid item xs={12}>
    <Select
      name="securityLevel"
      label="Sikkerhetsnivå"
      fullWidth
      required
    >
      {securityLevels.map((securityLevel, index) => (
        <MenuItem
          key={`security-level-item-${index}`}
          value={securityLevel?.securityLevelId?.id}
        >
          {securityLevel.securityLevelType}
        </MenuItem>
      ))}
    </Select>
  </Grid>
)}

  {mode !== "edit" && (
    <Grid item xs={12}>
      <Select name="eventOwner" label="Eier" fullWidth required>
        {eventOwners.map((eventOwner, index) => (
          <MenuItem
            key={`event-owner-item-${index}`}
            value={eventOwner.name}
          >
            {eventOwner.name}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  )}

<Grid item xs={6}>
  {mode !== "edit" ? (
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
  ) : (
    <section className={styles.dropzone}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Photo being edited"
          style={{
            width: "100%",
            maxHeight: "500px",
            objectFit: "contain",
            borderRadius: "6px",
          }}
        />
      ) : (
        <p>Laster bilde...</p>
      )}
    </section>
  )}
</Grid>



  

</Grid>
      <Dialog open={isLoading}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            paddingX: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "larger",
            }}
          >
            {progress === 100
              ? success
                ? "Velykket!"
                : "Opplasting feilet"
              : "Laster opp! 🦙"}
          </Typography>
          <BorderLinearProgress
            sx={{ width: "25vw" }}
            variant="determinate"
            value={progress}
          />
        </DialogContent>
      </Dialog>
    </div>
    </Form>
  );
};

export default PhotoUploadForm;
