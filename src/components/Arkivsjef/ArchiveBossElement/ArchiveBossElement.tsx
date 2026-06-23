import { useContext, useState } from "react";
import { MoreVertical } from "lucide-react";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import { PlaceApi } from "../../../utils/api/PlaceApi";
import { ArchiveBossContext } from "../../../contexts/ArchiveBossContext";
import DeleteDialog from "../../DeleteDialog/DeleteDialog";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/overlay/Popover";
import styles from "./ArchiveBossElement.module.css";

interface Props {
  text: string | undefined;
  id: string;
  type: string;
}

function ArchiveBossElement({ text, id, type }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const handleBeforeDelete = () => {
    setMenuOpen(false);
    setOpenDeleteDialog(true);
  };

  const handleDialogClose = (value: boolean) => {
    setOpenDeleteDialog(false);
    if (value) handleDelete();
  };

  const handleDelete = () => {
    if (type === "album") {
      void AlbumApi.deleteById(id)
        .then((res) => {
          if (res.data == 1) {
            setAlbums(albums.filter((album) => album?.albumId.id !== id));
          }
          setSeverity(severityEnum.SUCCESS);
          setMessage("Albumet ble slettet");
          setOpen(true);
        })
        .catch((e) => console.log(e));
    } else if (type === "place") {
      void PlaceApi.deleteById(id)
        .then((res) => {
          if (res.data == 1) {
            setPlaces(places.filter((place) => place?.placeId.id !== id));
          }
          setSeverity(severityEnum.SUCCESS);
          setMessage("Stedet ble slettet");
          setOpen(true);
        })
        .catch((e) => console.log(e));
    } else if (type === "category") {
      void CategoryApi.deleteById(id)
        .then((res) => {
          if (res.data == 1) {
            setCategories(
              categories.filter((category) => category?.categoryId.id !== id),
            );
            setSeverity(severityEnum.SUCCESS);
            setMessage("Kategorien ble slettet");
            setOpen(true);
          }
        })
        .catch((e) => console.log(e));
    }
    setUpdate(true);
  };

  return (
    <div className={styles.element}>
      <span className={styles.text}>{text}</span>
      <PopoverRoot open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button className={styles.menuButton} aria-label="Alternativer">
            <MoreVertical size={18} />
          </button>
        </PopoverTrigger>
        <PopoverContent className={styles.menu}>
          <button
            className={styles.menuItem}
            onClick={() => setMenuOpen(false)}
          >
            Rediger
          </button>
          <button className={styles.menuItem} onClick={handleBeforeDelete}>
            Slett
          </button>
        </PopoverContent>
      </PopoverRoot>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleDialogClose}
        name={text}
      />
    </div>
  );
}

export default ArchiveBossElement;
