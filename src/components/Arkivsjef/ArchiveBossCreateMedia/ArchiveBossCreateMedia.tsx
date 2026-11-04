import styles from "./ArchiveBossCreateMedia.module.css";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import type { MediaCreateRequest } from "@/utils/api/MediaApi";


interface Props {
  onClose: () => void;
  onCreate: (newMedia: MediaCreateRequest) => void;
}

function ArchiveBossCreateMedia({ onClose, onCreate }: Props) {
  const form = useAppForm({
    defaultValues: {
      media: "",
      analog: false,
    },

    onSubmit: ({ value }) => {
      console.log("hei");
      const newMedia: MediaCreateRequest = {
        medium: value.media,
        analog: value.analog,
      };
      onCreate(newMedia);
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"new_media_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Opprett nytt medium`}
      actions={
        <Button type="submit" form={"new-media-form"}>
          Opprett
        </Button>
      }
    >
      <form
        id="new-media-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
      <div className={styles.list_item}>
          <form.AppField name="media">
            {(field) => <field.TextInput label="Stedsnavn" autoFocus />}
          </form.AppField>
      </div>
        <div className={styles.list_item}>
          <form.AppField name="analog">
            {(field) => <field.Checkbox label="analog" />}
          </form.AppField>
        </div>

      </form>
    </Dialog>
  );
}

export default ArchiveBossCreateMedia;
