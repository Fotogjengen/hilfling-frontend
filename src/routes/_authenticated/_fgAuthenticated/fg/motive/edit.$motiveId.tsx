import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  AlbumDto,
  CategoryDto,
  EventOwnerDto,
  MotiveDto,
} from "@/../generated";
import { AlbumApi } from "@/utils/api/AlbumApi";
import { CategoryApi } from "@/utils/api/CategoryApi";
import { EventOwnerApi } from "@/utils/api/EventOwnerApi";
import { MotiveApi } from "@/utils/api/MotiveApi";
import styles from "./motiveEdit.module.css";
import MotiveCard from "@/components/MotiveCard/MotiveCard";
import { AlertContext, severityEnum } from "@/contexts/AlertContext";
import DeleteDialog from "@/components/DeleteDialog/DeleteDialog";
import { TextInput } from "@/components/ui/input/TextInput";
import { Combobox } from "@/components/ui/input/Combobox";
import { Button } from "@/components/ui/input/Button";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/motive/edit/$motiveId",
)({
  component: EditMotive,
});

function EditMotive() {
  const [motive, setMotive] = useState<MotiveDto>({} as MotiveDto);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [eventOwners, setEventOwners] = useState<EventOwnerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);
  const navigate = useNavigate();
  const { motiveId: id } = Route.useParams();

  const setError = (e: unknown) => {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage(String(e));
  };

  useEffect(() => {
    if (!id) return;
    Promise.all([
      MotiveApi.getById(id).then(setMotive),
      AlbumApi.getAll().then((res) => setAlbums(res.data.currentList)),
      CategoryApi.getAll().then((res) => setCategories(res.data.currentList)),
      EventOwnerApi.getAll().then((res) =>
        setEventOwners(res.data.currentList),
      ),
    ])
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleClickPatch = () => {
    void MotiveApi.patch(motive)
      .then(() => {
        void navigate({ to: "/fg/motive" });
        setOpen(true);
        setSeverity(severityEnum.SUCCESS);
        setMessage(`Motivet ${motive.title} ble oppdatert`);
      })
      .catch(setError);
  };

  const handleDelete = () => {
    // TODO: No delete endpoint yet
    void navigate({ to: "/fg/motive" });
  };

  return (
    <div className={styles.editMotive}>
      <h2>Rediger {motive?.title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.grid}>
          <div className={styles.fields}>
            <TextInput
              label="Endre navn på motiv"
              value={motive.title ?? ""}
              onChange={(e) => setMotive({ ...motive, title: e.target.value })}
            />
            <Combobox
              label="Endre kategori"
              options={categories}
              value={motive.categoryDto ?? null}
              getOptionLabel={(c) => c.name ?? ""}
              onChange={(c) => setMotive({ ...motive, categoryDto: c })}
            />
            <Combobox
              label="Endre album"
              options={albums}
              value={motive.albumDto ?? null}
              getOptionLabel={(a) => a.title ?? ""}
              onChange={(a) => setMotive({ ...motive, albumDto: a })}
            />
            <Combobox
              label="Endre eier"
              options={eventOwners}
              value={motive.eventOwnerDto ?? null}
              getOptionLabel={(e) => e.name ?? ""}
              onChange={(e) => setMotive({ ...motive, eventOwnerDto: e })}
            />
          </div>

          <div className={styles.preview}>
            <h6>Slik vil motivet se ut</h6>
            <MotiveCard motive={motive}>
              <div className={styles.cardActions}>
                <Button
                  variant="neutral"
                  size="sm"
                  disabled={!motive.title}
                  onClick={handleClickPatch}
                >
                  <Pencil size={14} />
                  Endre motivet
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </MotiveCard>
          </div>
        </div>
      )}
      <DeleteDialog
        open={openDeleteDialog}
        onClose={(confirmed) => {
          setOpenDeleteDialog(false);
          if (confirmed) handleDelete();
        }}
        name={motive.title}
      />
    </div>
  );
}

export default EditMotive;
