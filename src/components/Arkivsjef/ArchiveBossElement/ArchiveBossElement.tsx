import React, { FC, useContext, useState } from "react";
import { Grid, IconButton, Menu, MenuItem, Paper } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import { PlaceApi } from "../../../utils/api/PlaceApi";
import { ArchiveBossContext } from "../../../contexts/ArchiveBossContext";
import DeleteDialog from "../../DeleteDialog/DeleteDialog";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";

interface Props {
  /** Index of element when mapped */
  key: number | string | null | undefined;
  /** Text to display in the ArchiveBoss */
  text: string | undefined;
  /** Id belonging to the ArchiveBoss element */
  id: string;
  /** Type of Overflow menu */
  type: string;
}

const ArchiveBossElement: FC<Props> = ({ text, id, type }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  const {
    albums,
    setAlbums,
    places,
    setPlaces,
    categories,
    setCategories,
    setUpdate,
  } = useContext(ArchiveBossContext);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBeforeDelete = () => {
    handleClose();
    setOpenDeleteDialog(true);
  };
  const handleDialogClose = (value: boolean) => {
    setOpenDeleteDialog(false);
    if (value) {
      handleDelete();
    }
  };

  const handleDelete = () => {
    if (type === "album") {
      AlbumApi.deleteById(id)
        .then((res) => {
          if (res.data == 1) {
            setAlbums(albums.filter((album) => album?.albumId.id !== id));
          }
          setOpen(true);
          setSeverity(severityEnum.ERROR);
          setMessage(`Albumet ble slettet`);
        })
        .catch((e) => console.log(e));
    } else if (type === "place") {
      PlaceApi.deleteById(id)
        .then((res) => {
          if (res.data == 1) {
            setPlaces(places.filter((place) => place?.placeId.id !== id));
          }
          setOpen(true);
          setSeverity(severityEnum.ERROR);
          setMessage(`Stedet ble slettet`);
        })
        .catch((e) => console.log(e));
    } else if (type === "category") {
      CategoryApi.deleteById(id)
        .then((res) => {
          if (res.data == 1) {
            setCategories(
              categories.filter((category) => category?.categoryId.id !== id),
            );
            setOpen(true);
            setSeverity(severityEnum.ERROR);
            setMessage(`Kategorien ble slettet`);
          }
        })
        .catch((e) => console.log(e));
    }
    setAnchorEl(null);
    setUpdate(true);
  };

  return (
    <Paper style={{ padding: 8 }}>
      <Grid container alignItems="baseline">
        <Grid item xs={11} sm={11}>
          {text}
        </Grid>
        <Grid item xs={1} sm={1}>
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            <MenuItem key="edit" onClick={handleClose}>
              Rediger
            </MenuItem>
            <MenuItem key="delete" onClick={handleBeforeDelete}>
              Slett
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleDialogClose}
        name={text}
      />
    </Paper>
  );
};

export default ArchiveBossElement;
