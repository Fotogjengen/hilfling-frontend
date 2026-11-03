import styles from "./ArchiveBossEditMediaSchema.module.css";
import { MediaDto } from "../../../../generated";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { useUpdateMedia } from "@/hooks/media";

interface Props {
  dtoObject: MediaDto;
  onClose: () => void;
  onPatch: (dtoObject: MediaDto) => void;
}

function ArchiveBossMediaSchema({ dtoObject, onClose, onPatch }: Props) {
  const patchMedia = useUpdateMedia();
  const media = dtoObject;

  const form = useAppForm({
    defaultValues: {
      media: media.medium,
      analog: media.analog,
    },
    onSubmit: ({ value }) => {
      const newMedia: MediaDto = {
        mediaId: media.mediaId,
        medium: value.media,
        analog: value.analog,
      };
      onPatch(newMedia);
    },
  });
  return (
    <Dialog
      open
      aria-describedby={"Media_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${media.medium}`}
      actions={
        <Button
          type="submit"
          form={"edit-Media-form"}
          disabled={patchMedia.isPending}
        >
          {patchMedia.isPending ? "Lagrer..." : "Lagre endringer"}
        </Button>
      }
    >
      <form
        id="edit-Media-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField name="media">
            {(field) => <field.TextInput label="Medianavn" autoFocus />}
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

export default ArchiveBossMediaSchema;
