import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlbumDto,
  CategoryDto,
  EventOwnerDto,
  MotiveDto,
} from "../../../../generated";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import { EventOwnerApi } from "../../../utils/api/EventOwnerApi";
import { MotiveApi } from "../../../utils/api/MotiveApi";
import styles from "./EditMotive.module.css";
import MotiveCard from "../../../components/MotiveCard/MotiveCard";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import DeleteDialog from "../../../components/DeleteDialog/DeleteDialog";

const EditMotive = () => {
  const [motive, setMotive] = useState<MotiveDto>({} as MotiveDto);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [eventOwners, setEventOwners] = useState<EventOwnerDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      MotiveApi.getById(id)
        .then((res) => setMotive(res))
        .catch((e) => {
          setOpen(true);
          setSeverity(severityEnum.ERROR);
          setMessage(e);
        });
      AlbumApi.getAll()
        .then((res) => setAlbums(res.data.currentList))
        .catch((e) => {
          setOpen(true);
          setSeverity(severityEnum.ERROR);
          setMessage(e);
        });
      CategoryApi.getAll()
        .then((res) => setCategories(res.data.currentList))
        .catch((e) => {
          setOpen(true);
          setSeverity(severityEnum.ERROR);
          setMessage(e);
        });
      EventOwnerApi.getAll()
        .then((res) => setEventOwners(res.data.currentList))
        .catch((e) => {
          setOpen(true);
          setSeverity(severityEnum.ERROR);
          setMessage(e);
        });
    }
  }, []);

  useEffect(() => {
    if (motive && albums && categories && eventOwners) {
      setLoading(false);
    }
  }, [motive, albums, categories, eventOwners]);

  const handleClickPatch = () => {
    MotiveApi.patch(motive)
      .then(() => {
        navigate("/intern/motive");
        setOpen(true);
        setSeverity(severityEnum.SUCCESS);
        setMessage(`Motivet ${motive.title} ble oppdatert`);
      })
      .catch((e) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(e);
      });
  };

  const handleDialogClose = (value: boolean) => {
    setOpenDeleteDialog(false);
    if (value == true) {
      handleDelete();
    }
  };

  const handleBeforeDelete = () => {
    handleClose();
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    // TODO: We don't have an endpoint for deleting motives yet
    console.log("deleted");
    navigate("/intern/motive");
    /* MotiveApi.delete(motive.motiveId.id)
      .then(() => {
        navigate("/intern/motive");
        setOpen(true);
        setSeverity(severityEnum.SUCCESS);
        setMessage(`Motivet ${motive.title} ble slettet`);
      })
      .catch((e) => {
        setOpen(true);
        setSeverity(severityEnum.ERROR);
        setMessage(e);
      }); */
  };

  return (
    <div className={styles.editMotive}>
      <h2>Rediger {motive?.title}</h2>
      <Grid container spacing={2} alignItems="center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                value={motive.title || ""}
                onChange={(e) =>
                  setMotive({ ...motive, title: e.target.value })
                }
                label="Endre navn på motiv"
                margin="normal"
                fullWidth
              />
              <Autocomplete
                disablePortal
                getOptionLabel={(categories: CategoryDto) =>
                  categories?.name || ""
                }
                options={categories.map((category) => category)}
                // Used to suppress a warning idk why
                isOptionEqualToValue={(option, value) => option !== value}
                value={motive?.categoryDto || ""}
                onChange={(e, value) => {
                  if (value) {
                    setMotive({
                      ...motive,
                      categoryDto: {
                        ...motive.categoryDto,
                        name: value.name,
                        categoryId: {
                          ...motive.categoryDto?.categoryId,
                          id: value.categoryId.id,
                        },
                      },
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Endre kategori"
                    margin="normal"
                  />
                )}
              />
              <Autocomplete
                disablePortal
                getOptionLabel={(albums: AlbumDto) => albums?.title || ""}
                options={albums.map((album) => album || "")}
                isOptionEqualToValue={(option, value) => option !== value}
                value={motive?.albumDto || ""}
                onChange={(e, value) => {
                  if (value) {
                    setMotive({
                      ...motive,
                      albumDto: {
                        ...motive.albumDto,
                        title: value.title,
                        albumId: {
                          ...motive.albumDto?.albumId,
                          id: value.albumId.id,
                        },
                      },
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Endre album"
                    margin="normal"
                  />
                )}
              />
              <Autocomplete
                disablePortal
                getOptionLabel={(eventOwners: EventOwnerDto) =>
                  eventOwners?.name || ""
                }
                options={eventOwners.map((eventOwner) => eventOwner)}
                isOptionEqualToValue={(option, value) => option !== value}
                value={motive?.eventOwnerDto || ""}
                onChange={(e, value) => {
                  if (value) {
                    setMotive({
                      ...motive,
                      eventOwnerDto: {
                        ...motive.eventOwnerDto,
                        name: value.name,
                        eventOwnerId: {
                          ...motive.eventOwnerDto?.eventOwnerId,
                          id: value.eventOwnerId.id,
                        },
                      },
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Endre eier"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Slik vil motivet se ut</Typography>
              <MotiveCard key={1} motive={motive}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={10}>
                    {motive?.title == "" ? (
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<EditIcon />}
                        disabled
                        fullWidth
                      >
                        Endre motivet
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        endIcon={<EditIcon />}
                        onClick={handleClickPatch}
                        variant="outlined"
                        fullWidth
                      >
                        Endre motivet
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      onClick={() => handleBeforeDelete()}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </MotiveCard>
            </Grid>
          </>
        )}
      </Grid>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleDialogClose}
        name={motive.title}
      />
    </div>
  );
};

export default EditMotive;
