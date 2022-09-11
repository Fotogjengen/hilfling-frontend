import React, { useState, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  IconButton,
  Typography,
  MenuItem,
  Checkbox,
  Grid,
} from "@mui/material";
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
  const { setAlbums, setPlaces, setCategories, setUpdate, update } =
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
      setUpdate(true);
    } else if (values.type == "Sted") {
      PlaceApi.post({ name: values.name })
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
      setUpdate(true);
    } else if (values.type == "Album") {
      AlbumApi.post({ title: values.name, isAnalog: values.albumType })
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
      setUpdate(true);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (update) {
      AlbumApi.getAll()
        .then((res) => setAlbums(res.data.currentList))
        .catch((e) => console.log(e));
      PlaceApi.getAll()
        .then((res) => setPlaces(res.data.currentList))
        .catch((e) => console.log(e));
      CategoryApi.getAll()
        .then((res) => setCategories(res.data.currentList))
        .catch((e) => console.log(e));
      setUpdate(false);
    }
  }, [update]);

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
    <>
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
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={6}>
                      <Typography>Skal dette være et analogt album?</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={Checkbox}
                        name="albumType"
                        error={
                          props.errors.albumType && props.touched.albumType
                        }
                        type="checkbox"
                      />
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                <ErrorMessage name="name" />
                <ErrorMessage name="type" />
                {props.values.albumType}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Avbryt</Button>
                <Button variant="contained" type="submit" fullWidth>
                  Lag ny
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default ArchiveBossAddElements;
