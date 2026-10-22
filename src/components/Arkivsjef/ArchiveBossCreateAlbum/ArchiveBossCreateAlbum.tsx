import styles from "./ArchiveBossCreateAlbum.module.css";
import { AlbumPatchRequestDto, AlbumDto } from "../../../../generated";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { useUpdateAlbum } from "@/hooks/album";
import type { AlbumCreateRequest } from "@/utils/api/AlbumApi";

interface Props {
  onClose: () => void;
  onCreate: (newAlbum: AlbumCreateRequest) => void;
}

function ArchiveBossCreateAlbum({ onClose, onCreate }: Props) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      isAnalog: false,
    },

    onSubmit: ({ value }) => {
      const newAlbum: AlbumCreateRequest = {
        name: value.name,
        description: value.description,
        analog: value.isAnalog,
        isDefault: false,
      };
      onCreate(newAlbum);
    },
  });
  return (
    <Dialog
      open
      aria-describedby={"new_album_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Opprett nytt album`}
      actions={
        <Button type="submit" form={"new-album-form"}>
          Opprett
        </Button>
      }
    >
      <form
        id="new-album-form"
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

export default ArchiveBossCreateAlbum;
