import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Typography, MenuItem, Checkbox } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import styles from "./ArchiveBossAddElements.module.css";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as yup from "yup";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import { PlaceApi } from "../../../utils/api/PlaceApi";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { ArchiveBossContext } from "../../../views/Intern/Arkivsjef/ArchiveBossContext";

const ArchiveBossAddElements = () => {
  const [open, setOpen] = useState(false);
  const types: string[] = ["Kategori", "Sted", "Album"];
  const { albums, setAlbums, places, setPlaces, categories, setCategories } =
    useContext(ArchiveBossContext);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values: FormikValues) => {
    if (values.type == "Kategori") {
      CategoryApi.post({ name: values.name })
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
      // TODO: On-hold til vi får id fra backend
      setCategories([
        ...categories,
        { categoryId: { id: "123" }, name: values.name },
      ]);
    } else if (values.type == "Sted") {
      PlaceApi.post({ name: values.name })
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
      // TODO: On-hold til vi får id fra backend
      setPlaces([...places, { placeId: { id: "123" }, name: values.name }]);
    } else if (values.type == "Album") {
      AlbumApi.post({ title: values.name, isAnalog: values.albumType })
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
      // TODO: On-hold til vi får id fra backend
      setAlbums([
        ...albums,
        {
          albumId: { id: "123" },
          title: values.name,
          analog: values.albumType,
        },
      ]);
    }
    setOpen(false);
  };

  const validationSchema = yup.object({
    name: yup.string().required("Sliten? Du må fylle inn navn ❤️"),
    type: yup
      .string()
      .required("Du må legge til typen: kategori, sted eller album"),
    albumType: yup.boolean(),
  });
  const initialValues = {
    name: "",
    type: "",
    albumType: false,
  };

  return (
    <div>
      <IconButton aria-label="add" onClick={handleClickOpen}>
        <AddCircle className={styles.svgicon} />
      </IconButton>
      <Typography onClick={handleClickOpen}>Legg til ny</Typography>
      <Dialog open={open} onClose={handleClose}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props: {
            errors: { name: string; type: string; albumType: boolean };
            touched: { name: string; type: string; albumType: boolean };
            values: {
              type: string;
              albumType:
                | boolean
                | React.ReactChild
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
            };
          }) => (
            <Form>
              <DialogTitle>
                Legg til nytt album, ny kategori eller nytt sted
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Her kan du legge til nytt album, ny kategori eller nytt sted.
                  Denne funksjonen skal hovedsakelig brukes av arkivsjef.
                </DialogContentText>
                <br />
                <Field
                  as={TextField}
                  name="name"
                  label="Navn"
                  error={props.errors.name && props.touched.name}
                  fullWidth
                />
                <Field
                  as={TextField}
                  sx={{ marginTop: 1.5 }}
                  name="type"
                  label="Type"
                  error={props.errors.type && props.touched.type}
                  fullWidth
                  select
                >
                  {types.map((type, index) => {
                    return (
                      <MenuItem value={type} key={index}>
                        {type}
                      </MenuItem>
                    );
                  })}
                </Field>
                {props.values.type === "Album" ? (
                  <Field
                    as={Checkbox}
                    sx={{ marginTop: 1.5 }}
                    name="albumType"
                    error={props.errors.albumType && props.touched.albumType}
                    type="checkbox"
                  />
                ) : (
                  ""
                )}
                <ErrorMessage name="name" />
                <ErrorMessage name="type" />
                {props.values.albumType}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Avbryt</Button>
                <Button variant="contained" type="submit">
                  Lag ny
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ArchiveBossAddElements;