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
import styles from "../views/Intern/PhotoUpload/PhotoUpload.module.css";
import { useDropzone } from "react-dropzone";
import PhotoUploadPreview from "../components/PhotoUploadPreview/PhotoUploadPreview";
import { CategoryApi } from "../utils/api/CategoryApi";
import {
  AlbumDto,
  CategoryDto,
  EventOwnerDto,
  PlaceDto,
  SecurityLevelDto,
} from "../../generated";
import { PlaceApi } from "../utils/api/PlaceApi";
import { SecurityLevelApi } from "../utils/api/SecurityLevelApi";
import { AlbumApi } from "../utils/api/AlbumApi";
import { PhotoApi } from "../utils/api/PhotoApi";
import { EventOwnerApi } from "../utils/api/EventOwnerApi";
import { AlertContext, severityEnum } from "../contexts/AlertContext";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, nbNO } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface PhotoUploadFormIV {
  album: string;
  date: Date;
  motive: string;
  tags: string[];
  category: string;
  place: string;
  securityLevel: string;
  eventOwner: string;
}

interface Props {
  initialValues: PhotoUploadFormIV;
}

const PhotoUploadForm: FC<Props> = ({ initialValues }) => {
  //Handling file Uploads with dropzone
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".jpg,.jpeg,.png",
  });

  const [files, setFiles] = useState<DragNDropFile[]>([]); // stores the uploaded files
  const [albums, setAlbums] = useState<AlbumDto[]>([]); // stores api fetch data from dropdowns
  const [categories, setCategories] = useState<CategoryDto[]>([]); // stores api fetch data from dropdowns
  const [eventOwners, setEventOwners] = useState<EventOwnerDto[]>([]); // stores api fetch data from dropdowns
  const [places, setPlaces] = useState<PlaceDto[]>([]); // stores api fetch data from dropdowns
  const [securityLevels, setSecurityLevels] = useState<SecurityLevelDto[]>([]); // stores api fetch data from dropdowns
  const [formSubmitted, setFormSubmitted] = useState(false);

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

    SecurityLevelApi.getAll()
      .then((res) => setSecurityLevels(res.data.currentList))
      .catch((err) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(err.message);
      });
  }, []);

  useEffect(() => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...(acceptedFiles as DragNDropFile[]).map((file) => {
        file.isGoodPicture = false;
        return file;
      }),
    ]);
  }, [acceptedFiles]);
  useEffect(() => {
    console.log("categories");
    console.log(categories);
  }, [categories]);

  const onSubmit = async (values: Record<string, any>) => {
    setFormSubmitted(false); // Reset state before submission

    if (files.length === 0) {
      setOpen(true);
      setSeverity(severityEnum.ERROR);
      setMessage("Du må laste opp minst én fil");
      return false; // Prevent form submission
    }
    try {
      setIsLoading(true);
      setSuccess(false);

      const formattedDate = values["date"]
        ? new Date(values["date"]).toISOString().split("T")[0]
        : "";

      const formData = new FormData();
      formData.append("motiveTitle", values["motive"]);
      formData.append("securityLevelId", values["securityLevel"]);
      formData.append("placeName", values["place"]);
      formData.append("albumId", values["album"]);
      formData.append("categoryName", values["category"]);
      formData.append("eventOwnerName", values["eventOwner"]);
      formData.append("dateTaken", formattedDate);
      formData.append(
        "photoGangBangerId",
        "6a89444f-25f6-44d9-8a73-94587d72b839",
      ); // TODO: Use actual user Id
      formData.append("tagList", values["tags"]);

      files.forEach((dragNDropFile, index) => {
        formData.append(
          "isGoodPhotoList",
          JSON.stringify(dragNDropFile.isGoodPicture),
        );

        formData.append("photoFileList", acceptedFiles[index]);
      });

      console.log(formData);

      const handleUploadProgress = (progressEvent: ProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        console.log(`Upload progress: ${percentCompleted}%`);
        console.log(
          `Loaded: ${progressEvent.loaded}, Total: ${progressEvent.total}`,
        );
        setProgress(percentCompleted);
      };

      await PhotoApi.batchUpload(formData, handleUploadProgress);
      setFiles([]);
      setOpen(true);
      setSeverity(severityEnum.SUCCESS);
      setMessage("Photos uploaded successfully!");

      // PhotoApi.batchUpload(formData, handleUploadProgress)
      //   .then((res) => {
      //     console.log(res);
      //     setFiles([]);
      //   })
      //   .catch((err) => {
      //     setOpen(true);
      //     setSeverity(severityEnum.ERROR);
      //     setMessage(err.message);
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
      setSuccess(true);
      setFormSubmitted(true); // Indicate successful submission

      return true;
    } catch (error) {
      setOpen(true);
      setSeverity(severityEnum.ERROR);
      setMessage("Upload failed. Please try again.");
      setSuccess(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validate: Validate = (values: any): Errors => {
    if (formSubmitted) return {}; // Skip validation if form was just submitted

    const errors: Errors = {};

    // Album validation
    if (!values.album) {
      errors.album = "Album er påkrevd";
    }

    // Date validation
    if (!values.date) {
      errors.date = "Dato er påkrevd";
    } else {
      const selectedDate = new Date(values.date);
      const today = new Date();

      if (isNaN(selectedDate.getTime())) {
        errors.date = "Ugyldig dato";
      } else if (selectedDate > today) {
        errors.date = "Dato kan ikke være i fremtiden";
      }
    }

    // Motive validation
    if (!values.motive) {
      errors.motive = "Motiv er påkrevd";
    } else if (values.motive.length < 3) {
      errors.motive = "Motiv må være minst 3 tegn";
    }

    // Category validation
    if (!values.category) {
      errors.category = "Kategori er påkrevd";
    }

    // Place validation
    if (!values.place) {
      errors.place = "Sted er påkrevd";
    }

    // SecurityLevel validation
    if (!values.securityLevel) {
      errors.securityLevel = "Sikkerhetsnivå er påkrevd";
    }

    // EventOwner validation
    if (!values.eventOwner) {
      errors.eventOwner = "Eier er påkrevd";
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
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Select name="album" label="Album" fullWidth required>
                  {albums.map((album, index) => (
                    <MenuItem
                      key={`album-item-${index}`}
                      value={album?.albumId?.id}
                    >
                      {album.title}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={"NO"}
                  localeText={
                    nbNO.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePickerField
                    name="date"
                    label="Dato"
                    required
                    fullWidth
                  />
                </LocalizationProvider>
                {/* TODO: Add new datepicker, this one is outdated and not working */}
              </Grid>

              <Grid item xs={12}>
                <TextField name="motive" label="Motiv" fullWidth required />
              </Grid>

              {/*
              For Tags
              <Grid item xs={12}>
                <ChipField name="tags" label="Tags" fullWidth />
              </Grid> */}

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

              <Grid item xs={12}>
                <Select name="place" label="Sted" fullWidth required>
                  {places.map((place, index) => (
                    <MenuItem key={`place-item-${index}`} value={place.name}>
                      {place.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

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
            </Grid>
          </Form>
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
  );
};

export default PhotoUploadForm;
