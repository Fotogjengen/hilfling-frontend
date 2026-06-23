import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { DragNDropFile } from "../types";
import cx from "classnames";
import styles from "./PhotoUploadForm.module.css";
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
import { AlbumApi } from "../utils/api/AlbumApi";
import { PhotoApi } from "../utils/api/PhotoApi";
import { EventOwnerApi } from "../utils/api/EventOwnerApi";
import { AlertContext, severityEnum } from "../contexts/AlertContext";
import { AxiosProgressEvent } from "axios";
import useAppForm from "@/utils/form/FormContext";
import { Progress } from "@/components/ui/display/Progress";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/overlay/Dialog";

const schema = z.object({
  album: z.string().min(1, "Album er påkrevd"),
  date: z
    .date()
    .refine((d) => d <= new Date(), "Dato kan ikke være i fremtiden"),
  motive: z.string().min(3, "Motiv må være minst 3 tegn"),
  category: z.string().min(1, "Kategori er påkrevd"),
  place: z.string().min(1, "Sted er påkrevd"),
  securityLevel: z.string().min(1, "Sikkerhetsnivå er påkrevd"),
  eventOwner: z.string().min(1, "Eier er påkrevd"),
});

function uploadStatusTitle(progress: number, success: boolean) {
  if (progress < 100) return "Laster opp!";
  return success ? "Vellykket!" : "Opplasting feilet";
}

const PhotoUploadForm = () => {
  const [files, setFiles] = useState<DragNDropFile[]>([]);
  const [goodPictures, setGoodPictures] = useState<boolean[]>([]);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [eventOwners, setEventOwners] = useState<EventOwnerDto[]>([]);
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ".jpg,.jpeg,.png",
  });

  useEffect(() => {
    if (acceptedFiles.length === 0) return;
    setFiles((prev) => [...prev, ...(acceptedFiles as DragNDropFile[])]);
    setGoodPictures((prev) => [...prev, ...acceptedFiles.map(() => false)]);
  }, [acceptedFiles]);

  useEffect(() => {
    void Promise.all([
      AlbumApi.getAll().then((res) => setAlbums(res.data.currentList)),
      CategoryApi.getAll().then((res) => setCategories(res.data.currentList)),
      EventOwnerApi.getAll().then((res) =>
        setEventOwners(res.data.currentList),
      ),
      PlaceApi.getAll().then((res) => setPlaces(res.data.currentList)),
    ]).catch((err) => {
      setOpen(true);
      setSeverity(severityEnum.ERROR);
      setMessage(err.message);
    });
  }, []);

  const form = useAppForm({
    defaultValues: {
      album: "",
      date: new Date(),
      motive: "",
      category: "",
      place: "",
      securityLevel: "",
      eventOwner: "",
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      if (files.length === 0) {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage("Du må laste opp minst én fil");
        return;
      }

      setIsLoading(true);
      setProgress(0);
      setSuccess(false);

      try {
        const formattedDate = value.date.toISOString().split("T")[0];
        const handleUploadProgress = (e: AxiosProgressEvent) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        };

        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append("motive", value.motive);
          formData.append("security_level", value.securityLevel);
          formData.append("place", value.place);
          formData.append("album", value.album);
          formData.append("category", value.category);
          formData.append("event_owner", value.eventOwner);
          formData.append("date", formattedDate);
          formData.append(
            "photographer_id",
            "6a89444f-25f6-44d9-8a73-94587d72b839",
          ); // TODO: Use actual user id
          formData.append("is_good_picture", String(goodPictures[i] ?? false));
          formData.append("media", acceptedFiles[i]);
          await PhotoApi.batchUpload(formData, handleUploadProgress);
        }

        setFiles([]);
        setGoodPictures([]);
        setSuccess(true);
        setOpen(true);
        setSeverity(severityEnum.SUCCESS);
        setMessage("Photos uploaded successfully!");
      } catch {
        setSuccess(false);
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage("Upload failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setGoodPictures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGoodPictureChange = (index: number) => {
    setGoodPictures((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  return (
    <div>
      <div className={styles.grid}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className={styles.fields}
        >
          <form.AppField
            name="album"
            validators={{ onChange: schema.shape.album }}
          >
            {(field) => (
              <field.Select
                label="Album"
                placeholder="Velg album"
                options={albums.map((a) => ({
                  label: a.title,
                  value: a.title,
                }))}
              />
            )}
          </form.AppField>

          <form.AppField
            name="date"
            validators={{ onChange: schema.shape.date }}
          >
            {(field) => <field.DatePicker label="Dato" />}
          </form.AppField>

          <form.AppField
            name="motive"
            validators={{ onChange: schema.shape.motive }}
          >
            {(field) => <field.TextInput label="Motiv" />}
          </form.AppField>

          <form.AppField
            name="category"
            validators={{ onChange: schema.shape.category }}
          >
            {(field) => (
              <field.Select
                label="Kategori"
                placeholder="Velg kategori"
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.name,
                }))}
              />
            )}
          </form.AppField>

          <form.AppField
            name="place"
            validators={{ onChange: schema.shape.place }}
          >
            {(field) => (
              <field.Select
                label="Sted"
                placeholder="Velg sted"
                options={places.map((p) => ({ label: p.name, value: p.name }))}
              />
            )}
          </form.AppField>

          <form.AppField
            name="securityLevel"
            validators={{ onChange: schema.shape.securityLevel }}
          >
            {(field) => (
              <field.Select
                label="Sikkerhetsnivå"
                placeholder="Velg sikkerhetsnivå"
                options={Object.values(SecurityLevelDto.securityLevelType).map(
                  (s) => ({ label: s, value: s }),
                )}
              />
            )}
          </form.AppField>

          <form.AppField
            name="eventOwner"
            validators={{ onChange: schema.shape.eventOwner }}
          >
            {(field) => (
              <field.Select
                label="Eier"
                placeholder="Velg eier"
                options={eventOwners.map((e) => ({
                  label: e.name,
                  value: e.name,
                }))}
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton label="Last opp" />
          </form.AppForm>
        </form>

        <section className={styles.dropzoneSection}>
          <div {...getRootProps()} className={cx(styles.dropzone)}>
            <input {...getInputProps()} />
            <p>Dra og slipp filer her, eller klikk for å velge filer.</p>
          </div>
          <ul className={styles.noStyleUl}>
            {files.map((file, index) => (
              <li className={styles.fileList} key={file.name + file.path}>
                <div style={{ position: "relative" }}>
                  <PhotoUploadPreview
                    file={file}
                    isGoodPicture={goodPictures[index] ?? false}
                    handleChange={() => handleGoodPictureChange(index)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className={styles.removeFile}
                  >
                    <X size={12} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Dialog open={isLoading} title={uploadStatusTitle(progress, success)}>
        <Progress value={progress} className={styles.progress} />
      </Dialog>
    </div>
  );
};

export default PhotoUploadForm;
