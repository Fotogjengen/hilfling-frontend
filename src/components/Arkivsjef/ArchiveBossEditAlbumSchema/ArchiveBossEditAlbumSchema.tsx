import styles from "./ArchiveBossEditAlbumSchema.module.css";
import { AlbumPatchRequestDto, AlbumDto } from "../../../../generated";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { useUpdateAlbum } from "@/hooks/album";

interface Props {
  dtoObject: AlbumDto;
  onClose: () => void;
  onPatch: (dtoObject: AlbumDto) => void;
}

function ArchiveBossAlbumSchema({ dtoObject, onClose, onPatch }: Props) {
  const patchAlbum = useUpdateAlbum();
  const album = dtoObject;

  const form = useAppForm({
    defaultValues: {
      name: album.name,
      description: album.description,
      isAnalog: album.analog,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      const patchAlbum :AlbumDto = {
        albumId: album.albumId,
        name: value.name,
        description: value.description,
        analog: value.isAnalog,
        isDefault: album.isDefault,
      };
      onPatch(patchAlbum)
    },
  });
  return (
    <Dialog
      open
      aria-describedby={"album_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${album.description}`}
      actions={
        <Button
          type="submit"
          form={"edit-album-form"}
          disabled={patchAlbum.isPending}
        >
          {patchAlbum.isPending ? "Lagrer..." : "Lagre endringer"}
        </Button>
      }
    >
      <form
        id="edit-album-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField name="name">
            {(field) => <field.TextInput label="Albumnavn" autoFocus />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField name="description">
            {(field) => <field.TextInput label="Beskrivelse" autoFocus />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField name="isAnalog">
            {(field) => <field.Checkbox label="Analog" />}
          </form.AppField>
        </div>
      </form>
    </Dialog>
  );
}

export default ArchiveBossAlbumSchema;
