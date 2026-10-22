import styles from "./ArchiveBossEditPlaceSchema.module.css";
import { PlaceDto, PlacePatchRequestDto } from "../../../../generated";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { useUpdatePlace } from "@/hooks/place";

interface Props {
  dtoObject: PlaceDto;
  onClose: () => void;
  onPatch: (dtoObject: PlaceDto) => void;
}

function ArchiveBossEditPlaceSchema({dtoObject, onClose, onPatch }: Props) {
  const patchPlace = useUpdatePlace();
  const place = dtoObject;

  const form = useAppForm({
    defaultValues: {
      name: place.name,
    },
    onSubmit: ({ value }) => {

      const patch_object: PlaceDto = {
        placeId: place.placeId,
        name: value.name,
      };
      onPatch(patch_object);
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"place_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${place.name}`}
      actions={
        <Button
          type="submit"
          form={"edit-album-form"}
          disabled={patchPlace.isPending}
        >
          {patchPlace.isPending ? "Lagrer..." : "Lagre endringer"}
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
      </form>
    </Dialog>
  );
}

export default ArchiveBossEditPlaceSchema;
